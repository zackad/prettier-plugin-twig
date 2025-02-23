/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as n from "../melody-types/index.js";
import * as Types from "./TokenTypes.js";
import { LEFT, RIGHT } from "./Associativity.js";
import {
    setStartFromToken,
    setEndFromToken,
    setMarkFromToken,
    copyStart,
    copyEnd,
    copyLoc,
    createNode
} from "./util.js";
import { GenericTagParser } from "./GenericTagParser.js";
import { createMultiTagParser } from "./GenericMultiTagParser.js";
import { voidElements } from "./elementInfo.js";
import * as he from "he";
import { Attribute } from "../melody-types/index.js";

/**
 * @typedef {Object} UnaryOperator
 * @property {string} text - The text representation of the unary operator.
 * @property {number} precedence - The precedence of the unary operator.
 * @property {Function} createNode - A function to create a node for the unary operator.
 */

/**
 * @typedef {Object} BinaryOperator
 * @property {string} text - The text representation of the binary operator.
 * @property {number} precedence - The precedence of the binary operator.
 * @property {Function} createNode - A function to create a node for the binary operator.
 * @property {('LEFT'|'RIGHT')} associativity - The associativity of the binary operator.
 * @property {Function} parse - A function to parse the binary operator.
 */

const UNARY = Symbol("UNARY");
const BINARY = Symbol("BINARY");
const TAG = Symbol("TAG");
const TEST = Symbol("TEST");

export default class Parser {
    /**
     * @param {TokenStream} tokenStream
     * @param {Object} options
     */
    constructor(tokenStream, options) {
        this.tokens = tokenStream;
        this[UNARY] = {};
        this[BINARY] = {};
        this[TAG] = {};
        this[TEST] = {};
        this.options = Object.assign(
            {},
            {
                ignoreComments: true,
                ignoreHtmlComments: true,
                ignoreDeclarations: true,
                decodeEntities: true,
                preserveSourceLiterally: false,
                allowUnknownTags: false,
                multiTags: {} // e.g. { "nav": ["endnav"], "switch": ["case", "default", "endswitch"]}
            },
            options
        );
        // If there are custom multi tags, then we allow all custom tags
        if (Object.keys(this.options.multiTags).length > 0) {
            this.options.allowUnknownTags = true;
        }
    }

    applyExtension(ext) {
        if (ext.tags) {
            for (const tag of ext.tags) {
                this.addTag(tag);
            }
        }
        if (ext.unaryOperators) {
            for (const op of ext.unaryOperators) {
                this.addUnaryOperator(op);
            }
        }
        if (ext.binaryOperators) {
            for (const op of ext.binaryOperators) {
                this.addBinaryOperator(op);
            }
        }
        if (ext.tests) {
            for (const test of ext.tests) {
                this.addTest(test);
            }
        }
    }

    /**
     * @param {UnaryOperator} op
     */
    addUnaryOperator(op) {
        this[UNARY][op.text] = op;
        return this;
    }

    /**
     * @param {BinaryOperator} op
     */
    addBinaryOperator(op) {
        this[BINARY][op.text] = op;
        return this;
    }

    addTag(tag) {
        this[TAG][tag.name] = tag;
        return this;
    }

    addTest(test) {
        this[TEST][test.text] = test;
    }

    hasTest(test) {
        return !!this[TEST][test];
    }

    getTest(test) {
        return this[TEST][test];
    }

    isUnary(token) {
        return token.type === Types.OPERATOR && !!this[UNARY][token.text];
    }

    getBinaryOperator(token) {
        return token.type === Types.OPERATOR && this[BINARY][token.text];
    }

    parse(test = null) {
        const tokens = this.tokens;
        let p = setStartFromToken(new n.SequenceExpression(), tokens.la(0));
        while (!tokens.test(Types.EOF)) {
            const token = tokens.next();
            if (!p) {
                p = setStartFromToken(new n.SequenceExpression(), token);
            }
            if (test && test(tokens.la(0).text, token, tokens)) {
                setEndFromToken(p, token);
                return p;
            }
            switch (token.type) {
                case Types.EXPRESSION_START: {
                    const expression = this.matchExpression();
                    const statement = new n.PrintExpressionStatement(
                        expression
                    );
                    const endToken = tokens.expect(Types.EXPRESSION_END);
                    setStartFromToken(statement, token);
                    setEndFromToken(statement, endToken);
                    setEndFromToken(p, endToken);
                    statement.trimLeft = !!expression.trimLeft;
                    statement.trimRight = !!expression.trimRight;
                    p.add(statement);

                    break;
                }
                case Types.TAG_START:
                    p.add(this.matchTag());
                    break;
                case Types.TEXT: {
                    const textStringLiteral = createNode(
                        n.StringLiteral,
                        token,
                        token.text
                    );
                    const textTextStatement = createNode(
                        n.PrintTextStatement,
                        token,
                        textStringLiteral
                    );
                    p.add(textTextStatement);
                    break;
                }
                case Types.ENTITY: {
                    const entityStringLiteral = createNode(
                        n.StringLiteral,
                        token,
                        !this.options.decodeEntities ||
                            this.options.preserveSourceLiterally
                            ? token.text
                            : he.decode(token.text)
                    );
                    const entityTextStatement = createNode(
                        n.PrintTextStatement,
                        token,
                        entityStringLiteral
                    );
                    p.add(entityTextStatement);
                    break;
                }
                case Types.ELEMENT_START:
                    p.add(this.matchElement());
                    break;
                case Types.DECLARATION_START: {
                    const declarationNode = this.matchDeclaration();
                    if (!this.options.ignoreDeclarations) {
                        p.add(declarationNode);
                    }
                    break;
                }
                case Types.COMMENT:
                    if (!this.options.ignoreComments) {
                        const stringLiteral = createNode(
                            n.StringLiteral,
                            token,
                            token.text
                        );
                        const twigComment = createNode(
                            n.TwigComment,
                            token,
                            stringLiteral
                        );
                        p.add(twigComment);
                    }
                    break;
                case Types.HTML_COMMENT:
                    if (!this.options.ignoreHtmlComments) {
                        const stringLiteral = createNode(
                            n.StringLiteral,
                            token,
                            token.text
                        );
                        const htmlComment = createNode(
                            n.HtmlComment,
                            token,
                            stringLiteral
                        );
                        p.add(htmlComment);
                    }
                    break;
            }
        }
        return p;
    }

    /**
     * e.g., <!DOCTYPE html>
     */
    matchDeclaration() {
        const tokens = this.tokens;
        const declarationStartToken = tokens.la(-1);
        let declarationType = null;
        let currentToken = null;

        if (!(declarationType = tokens.nextIf(Types.SYMBOL))) {
            this.error({
                title: "Expected declaration start",
                pos: declarationStartToken.pos,
                advice: "After '<!', an unquoted symbol like DOCTYPE is expected"
            });
        }

        const declaration = new n.Declaration(declarationType.text);
        while ((currentToken = tokens.next())) {
            if (currentToken.type === Types.SYMBOL) {
                const symbol = createNode(
                    n.Identifier,
                    currentToken,
                    currentToken.text
                );
                declaration.parts.push(symbol);
            } else if (currentToken.type === Types.STRING_START) {
                const stringToken = tokens.expect(Types.STRING);
                declaration.parts.push(
                    createNode(n.StringLiteral, stringToken, stringToken.text)
                );
                tokens.expect(Types.STRING_END);
            } else if (currentToken.type === Types.EXPRESSION_START) {
                const expression = this.matchExpression();
                declaration.parts.push(
                    copyLoc(
                        new n.PrintExpressionStatement(expression),
                        expression
                    )
                );
                tokens.expect(Types.EXPRESSION_END);
            } else if (currentToken.type === Types.ELEMENT_END) {
                break;
            } else {
                this.error({
                    title: "Expected string, symbol, or expression",
                    pos: currentToken.pos,
                    advice: "Only strings or symbols can be part of a declaration"
                });
            }
        }
        setStartFromToken(declaration, declarationStartToken);
        setEndFromToken(declaration, currentToken);

        return declaration;
    }

    /**
     * matchElement = '<' SYMBOL attributes* '/'? '>' (children)* '<' '/' SYMBOL '>'
     * attributes = SYMBOL '=' (matchExpression | matchString)
     *              | matchExpression
     */
    matchElement() {
        const tokens = this.tokens;
        const elementNameToken = tokens.la(0);
        const tagStartToken = tokens.la(-1);
        let elementName;
        if (!(elementName = tokens.nextIf(Types.SYMBOL))) {
            this.error({
                title: "Expected element start",
                pos: elementNameToken.pos,
                advice:
                    tokens.lat(0) === Types.SLASH
                        ? `Unexpected closing "${
                              tokens.la(1).text
                          }" tag. Seems like your DOM is out of control.`
                        : "Expected an element to start"
            });
        }

        const element = new n.Element(elementName.text);

        this.matchAttributes(element, tokens);

        if (tokens.nextIf(Types.SLASH)) {
            tokens.expect(Types.ELEMENT_END);
            element.selfClosing = true;
        } else {
            tokens.expect(Types.ELEMENT_END);
            if (voidElements[elementName.text]) {
                element.selfClosing = true;
            } else {
                element.children = this.parse((_, token, tokens) => {
                    if (
                        token.type === Types.ELEMENT_START &&
                        tokens.lat(0) === Types.SLASH
                    ) {
                        const name = tokens.la(1);
                        if (
                            name.type === Types.SYMBOL &&
                            name.text === elementName.text
                        ) {
                            tokens.next(); // SLASH
                            tokens.next(); // elementName
                            tokens.expect(Types.ELEMENT_END);
                            return true;
                        }
                    }
                    return false;
                }).expressions;
            }
        }

        setStartFromToken(element, tagStartToken);
        setEndFromToken(element, tokens.la(-1));
        setMarkFromToken(element, "elementNameLoc", elementNameToken);

        return element;
    }

    matchAttributes(element, tokens) {
        while (
            tokens.lat(0) !== Types.SLASH &&
            tokens.lat(0) !== Types.ELEMENT_END
        ) {
            const key = tokens.nextIf(Types.SYMBOL);
            let twigComment;
            if (key) {
                const keyNode = new n.Identifier(key.text);
                setStartFromToken(keyNode, key);
                setEndFromToken(keyNode, key);

                // match an attribute
                if (tokens.nextIf(Types.ASSIGNMENT)) {
                    const start = tokens.expect(Types.STRING_START);
                    let canBeString = true;
                    const nodes = [];
                    let token;
                    while (!tokens.test(Types.STRING_END)) {
                        if (
                            canBeString &&
                            (token = tokens.nextIf(Types.STRING))
                        ) {
                            nodes[nodes.length] = createNode(
                                n.StringLiteral,
                                token,
                                token.text
                            );
                            canBeString = false;
                        } else if (
                            (token = tokens.nextIf(Types.EXPRESSION_START))
                        ) {
                            nodes[nodes.length] = this.matchExpression();
                            tokens.expect(Types.EXPRESSION_END);
                            canBeString = true;
                        } else {
                            break;
                        }
                    }
                    tokens.expect(Types.STRING_END);
                    if (!nodes.length) {
                        const node = createNode(n.StringLiteral, start, "");
                        nodes.push(node);
                    }

                    let expr = nodes[0];
                    for (let i = 1, len = nodes.length; i < len; i++) {
                        const { line, column } = expr.loc.start;
                        expr = new n.BinaryConcatExpression(expr, nodes[i]);
                        expr.loc.start.line = line;
                        expr.loc.start.column = column;
                        copyEnd(expr, expr.right);
                    }
                    // Distinguish between BinaryConcatExpression generated by
                    // this Parser (implicit before parsing), and those that the
                    // user wrote explicitly.
                    if (nodes.length > 1) {
                        expr.wasImplicitConcatenation = true;
                    }
                    const attr = new n.Attribute(keyNode, expr);
                    copyStart(attr, keyNode);
                    copyEnd(attr, expr);
                    element.attributes.push(attr);
                } else {
                    element.attributes.push(
                        copyLoc(new n.Attribute(keyNode), keyNode)
                    );
                }
            } else if (tokens.nextIf(Types.EXPRESSION_START)) {
                element.attributes.push(this.matchExpression());
                tokens.expect(Types.EXPRESSION_END);
            } else if (tokens.nextIf(Types.TAG_START)) {
                const tagExpression = this.matchTag();
                element.attributes.push(tagExpression);
            } else if ((twigComment = tokens.nextIf(Types.COMMENT))) {
                const twigCommentValue = new n.StringLiteral(twigComment.text);
                const twigCommentNode = new n.TwigComment(twigCommentValue);
                element.attributes.push(twigCommentNode);
            } else {
                this.error({
                    title: "Invalid token",
                    pos: tokens.la(0).pos,
                    advice: "A tag must consist of attributes or expressions. Twig Tags are not allowed."
                });
            }
        }
    }

    error(options, metadata = {}) {
        this.tokens.error(
            options.title,
            options.pos,
            options.advice,
            1,
            metadata
        );
    }

    getGenericParserFor(tagName) {
        if (this.options.multiTags[tagName]) {
            return createMultiTagParser(
                tagName,
                this.options.multiTags[tagName]
            );
        }
        return GenericTagParser;
    }

    matchTag() {
        const tokens = this.tokens;
        const tagStartToken = tokens.la(-1);

        const tag = tokens.expect(Types.SYMBOL);
        let parser = this[TAG][tag.text];
        let isUsingGenericParser = false;
        if (!parser) {
            if (this.options.allowUnknownTags) {
                parser = this.getGenericParserFor(tag.text);
                isUsingGenericParser = true;
            } else {
                tokens.error(
                    `Unknown tag "${tag.text}"`,
                    tag.pos,
                    `Expected a known tag such as\n- ${Object.getOwnPropertyNames(
                        this[TAG]
                    ).join("\n- ")}`,
                    tag.length
                );
            }
        }

        const result = parser.parse(this, tag);
        const tagEndToken = tokens.la(-1);
        if (!isUsingGenericParser) {
            result.trimLeft = tagStartToken.text.endsWith("-");
            result.trimRight = tagEndToken.text.startsWith("-");
        }

        setStartFromToken(result, tagStartToken);
        setEndFromToken(result, tagEndToken);
        setMarkFromToken(result, "tagNameLoc", tag);

        return result;
    }

    matchExpression(precedence = 0) {
        const tokens = this.tokens;
        const exprStartToken = tokens.la(0);
        let token;
        let op;
        let trimLeft = false;

        // Check for {{- (trim preceding whitespace)
        if (
            tokens.la(-1).type === Types.EXPRESSION_START &&
            tokens.la(-1).text.endsWith("-")
        ) {
            trimLeft = true;
        }

        let expr = this.getPrimary();
        while (
            (token = tokens.la(0)) &&
            token.type !== Types.EOF &&
            (op = this.getBinaryOperator(token)) &&
            op.precedence >= precedence
        ) {
            const opToken = tokens.next(); // consume the operator
            if (op.parse) {
                expr = op.parse(this, opToken, expr);
            } else {
                const expr1 = this.matchExpression(
                    op.associativity === LEFT
                        ? op.precedence + 1
                        : op.precedence
                );
                expr = op.createNode(token, expr, expr1);
            }
            token = tokens.la(0);
        }

        let result = expr;
        if (precedence === 0) {
            setEndFromToken(expr, tokens.la(-1));
            result = this.matchConditionalExpression(expr);
            // Update the local token variable because the stream pointer already advanced.
            token = tokens.la(0);
        }

        // Check for -}} (trim following whitespace)
        if (token.type === Types.EXPRESSION_END && token.text.startsWith("-")) {
            result.trimRight = true;
        }
        if (trimLeft) {
            result.trimLeft = trimLeft;
        }

        const exprEndToken = tokens.la(-1);
        setStartFromToken(result, exprStartToken);
        setEndFromToken(result, exprEndToken);

        return result;
    }

    getPrimary() {
        const tokens = this.tokens;
        const token = tokens.la(0);
        if (this.isUnary(token)) {
            const op = this[UNARY][token.text];
            tokens.next(); // consume operator
            const expr = this.matchExpression(op.precedence);
            return this.matchPostfixExpression(op.createNode(token, expr));
        } else if (tokens.test(Types.LPAREN)) {
            tokens.next(); // consume '('
            const expr = this.matchExpression();
            tokens.expect(Types.RPAREN);
            return this.matchPostfixExpression(expr);
        }

        return this.matchPrimaryExpression();
    }

    matchPrimaryExpression() {
        const tokens = this.tokens;
        const token = tokens.la(0);
        let node;
        switch (token.type) {
            case Types.NULL:
                node = createNode(n.NullLiteral, tokens.next());
                break;
            case Types.FALSE:
                node = createNode(n.BooleanLiteral, tokens.next(), false);
                break;
            case Types.TRUE:
                node = createNode(n.BooleanLiteral, tokens.next(), true);
                break;
            case Types.SYMBOL:
                tokens.next();
                if (tokens.test(Types.LPAREN)) {
                    // SYMBOL '(' arguments* ')'
                    node = new n.CallExpression(
                        createNode(n.Identifier, token, token.text),
                        this.matchArguments()
                    );
                    copyStart(node, node.callee);
                    setEndFromToken(node, tokens.la(-1)); // ')'
                } else {
                    node = createNode(n.Identifier, token, token.text);
                }
                break;
            case Types.NUMBER:
                node = createNode(
                    n.NumericLiteral,
                    token,
                    Number(tokens.next())
                );
                break;
            case Types.STRING_START:
                node = this.matchStringExpression();
                break;
            // potentially missing: OPERATOR type
            default:
                if (token.type === Types.LBRACE) {
                    node = this.matchArray();
                } else if (token.type === Types.LBRACKET) {
                    node = this.matchMapping();
                } else {
                    this.error(
                        {
                            title:
                                'Unexpected token "' +
                                token.type +
                                '" of value "' +
                                token.text +
                                '"',
                            pos: token.pos
                        },
                        {
                            errorType: "UNEXPECTED_TOKEN",
                            tokenText: token.text,
                            tokenType: token.type
                        }
                    );
                }
                break;
        }

        return this.matchPostfixExpression(node);
    }

    matchStringExpression() {
        let canBeString = true;
        let token;
        const tokens = this.tokens;
        const nodes = [];
        const stringStart = tokens.expect(Types.STRING_START);
        while (!tokens.test(Types.STRING_END)) {
            if (canBeString && (token = tokens.nextIf(Types.STRING))) {
                nodes[nodes.length] = createNode(
                    n.StringLiteral,
                    token,
                    token.text
                );
                canBeString = false;
            } else if ((token = tokens.nextIf(Types.INTERPOLATION_START))) {
                nodes[nodes.length] = this.matchExpression();
                tokens.expect(Types.INTERPOLATION_END);
                canBeString = true;
            } else {
                break;
            }
        }
        const stringEnd = tokens.expect(Types.STRING_END);

        if (!nodes.length) {
            return setEndFromToken(
                createNode(n.StringLiteral, stringStart, ""),
                stringEnd
            );
        }

        let expr = nodes[0];
        for (let i = 1, len = nodes.length; i < len; i++) {
            const { line, column } = expr.loc.start;
            expr = new n.BinaryConcatExpression(expr, nodes[i]);
            expr.loc.start.line = line;
            expr.loc.start.column = column;
            copyEnd(expr, expr.right);
        }

        if (nodes.length > 1) {
            expr.wasImplicitConcatenation = true;
        }

        setStartFromToken(expr, stringStart);
        setEndFromToken(expr, stringEnd);

        return expr;
    }

    /**
     * @param {Node} test
     */
    matchConditionalExpression(test) {
        const tokens = this.tokens;
        let condition = test;
        let consequent;
        let alternate;
        while (tokens.nextIf(Types.QUESTION_MARK)) {
            if (!tokens.nextIf(Types.COLON)) {
                consequent = this.matchExpression();
                if (tokens.nextIf(Types.COLON)) {
                    alternate = this.matchExpression();
                } else {
                    alternate = null;
                }
            } else {
                consequent = null;
                alternate = this.matchExpression();
            }
            const { line, column } = condition.loc.start;
            condition = new n.ConditionalExpression(
                condition,
                consequent,
                alternate
            );
            condition.loc.start = { line, column };
            copyEnd(condition, alternate || consequent);
        }
        return condition;
    }

    matchArray() {
        const tokens = this.tokens;
        const array = new n.ArrayExpression();
        const start = tokens.expect(Types.LBRACE);
        setStartFromToken(array, start);
        while (!tokens.test(Types.RBRACE) && !tokens.test(Types.EOF)) {
            array.elements.push(this.matchExpression());
            if (!tokens.test(Types.RBRACE)) {
                tokens.expect(Types.COMMA);
                // support trailing commas
                if (tokens.test(Types.RBRACE)) {
                    break;
                }
            }
        }
        setEndFromToken(array, tokens.expect(Types.RBRACE));
        return array;
    }

    matchMapping() {
        const tokens = this.tokens;
        let token;
        const obj = new n.ObjectExpression();
        const startToken = tokens.expect(Types.LBRACKET);
        setStartFromToken(obj, startToken);
        while (!tokens.test(Types.RBRACKET) && !tokens.test(Types.EOF)) {
            let computed = false;
            let key;

            // find the key part of object property
            if (tokens.test(Types.STRING_START)) {
                key = this.matchStringExpression();
                if (!n.is(key, "StringLiteral")) {
                    computed = true;
                }
            } else if ((token = tokens.nextIf(Types.EXPRESSION_START))) {
                key = this.matchExpression();
                computed = true;
            } else if ((token = tokens.nextIf(Types.SYMBOL))) {
                key = createNode(n.Identifier, token, token.text);
            } else if ((token = tokens.nextIf(Types.NUMBER))) {
                key = createNode(n.NumericLiteral, token, Number(token.text));
            } else if (tokens.test(Types.LPAREN)) {
                key = this.matchExpression();
                computed = true;
            } else {
                // if none above check is matches, we can assume that key part is being omitted
                // noop
            }

            // find the value part of object property
            if (tokens.test(Types.COLON)) {
                tokens.expect(Types.COLON);
                const value = this.matchExpression();
                const prop = new n.ObjectProperty(value, computed, key);
                copyStart(prop, key);
                copyEnd(prop, value);
                obj.properties.push(prop);
            } else {
                // when the part is missing, we can assume that it is being omitted
                if (key === undefined) {
                    computed = true;
                    key = this.matchExpression();
                }
                const value = key;
                const prop = new n.ObjectProperty(value, computed);
                copyStart(prop, key);
                copyEnd(prop, value);
                obj.properties.push(prop);
            }

            if (!tokens.test(Types.RBRACKET)) {
                tokens.expect(Types.COMMA);
                // support trailing comma
                if (tokens.test(Types.RBRACKET)) {
                    break;
                }
            }
        }
        setEndFromToken(obj, tokens.expect(Types.RBRACKET));
        return obj;
    }

    matchPostfixExpression(expr) {
        const tokens = this.tokens;
        let node = expr;
        while (!tokens.test(Types.EOF)) {
            if (tokens.test(Types.DOT) || tokens.test(Types.LBRACE)) {
                node = this.matchSubscriptExpression(node);
            } else if (tokens.test(Types.PIPE)) {
                tokens.next();
                node = this.matchFilterExpression(node);
            } else {
                break;
            }
        }

        return node;
    }

    matchSubscriptExpression(node) {
        const tokens = this.tokens;
        const op = tokens.next();
        if (op.type === Types.DOT) {
            const token = tokens.next();
            let computed = false;
            let property;
            if (token.type === Types.SYMBOL) {
                property = createNode(n.Identifier, token, token.text);
            } else if (token.type === Types.NUMBER) {
                property = createNode(
                    n.NumericLiteral,
                    token,
                    Number(token.text)
                );
                computed = true;
            } else {
                this.error({
                    title: "Invalid token",
                    pos: token.pos,
                    advice:
                        "Expected number or symbol, found " + token + " instead"
                });
            }

            const memberExpr = new n.MemberExpression(node, property, computed);
            copyStart(memberExpr, node);
            copyEnd(memberExpr, property);
            if (tokens.test(Types.LPAREN)) {
                const callExpr = new n.CallExpression(
                    memberExpr,
                    this.matchArguments()
                );
                copyStart(callExpr, memberExpr);
                setEndFromToken(callExpr, tokens.la(-1));
                return callExpr;
            }
            return memberExpr;
        }
        let arg;
        let start;
        if (tokens.test(Types.COLON)) {
            // slice
            tokens.next();
            start = null;
        } else {
            arg = this.matchExpression();
            if (tokens.test(Types.COLON)) {
                start = arg;
                arg = null;
                tokens.next();
            }
        }

        if (arg) {
            return setEndFromToken(
                copyStart(new n.MemberExpression(node, arg, true), node),
                tokens.expect(Types.RBRACE)
            );
        }
        // slice
        const result = new n.SliceExpression(
            node,
            start,
            tokens.test(Types.RBRACE) ? null : this.matchExpression()
        );
        copyStart(result, node);
        setEndFromToken(result, tokens.expect(Types.RBRACE));
        return result;
    }

    matchFilterExpression(node) {
        const tokens = this.tokens;
        let target = node;
        while (!tokens.test(Types.EOF)) {
            const token = tokens.expect(Types.SYMBOL);
            const name = createNode(n.Identifier, token, token.text);
            let args;
            if (tokens.test(Types.LPAREN)) {
                args = this.matchArguments();
            } else {
                args = [];
            }
            const newTarget = new n.FilterExpression(target, name, args);
            copyStart(newTarget, target);
            if (newTarget.arguments.length) {
                copyEnd(
                    newTarget,
                    newTarget.arguments[newTarget.arguments.length - 1]
                );
            } else {
                copyEnd(newTarget, target);
            }
            target = newTarget;

            if (!tokens.test(Types.PIPE) || tokens.test(Types.EOF)) {
                break;
            }

            tokens.next(); // consume '|'
        }
        return target;
    }

    matchArguments() {
        const tokens = this.tokens;
        const args = [];
        tokens.expect(Types.LPAREN);
        while (!tokens.test(Types.RPAREN) && !tokens.test(Types.EOF)) {
            if (
                tokens.test(Types.LPAREN) ||
                (tokens.test(Types.SYMBOL) && tokens.lat(1) === Types.ARROW)
            ) {
                // OPTION 1: filter argument with arrow function
                const arrowFunction = this.matchArrowFunction();
                copyEnd(arrowFunction, arrowFunction.body);
                args.push(arrowFunction);
            } else if (
                tokens.test(Types.SYMBOL) &&
                (tokens.lat(1) === Types.ASSIGNMENT ||
                    tokens.lat(1) === Types.COLON)
            ) {
                // OPTION 2: named filter argument(s)
                const name = tokens.next();
                tokens.next();
                const value = this.matchExpression();
                const arg = new n.NamedArgumentExpression(
                    createNode(n.Identifier, name, name.text),
                    value
                );
                copyEnd(arg, value);
                args.push(arg);
            } else {
                // OPTION 3: unnamed filter argument(s)
                args.push(this.matchExpression());
            }

            // No comma means end of filter arguments, return filter arguments to matchFilterExpression()
            if (!tokens.test(Types.COMMA)) {
                tokens.expect(Types.RPAREN);
                return args;
            }
            // Otherwise, expect a comma and run again
            tokens.expect(Types.COMMA);
        }
        // End of arguments
        tokens.expect(Types.RPAREN);
        return args;
    }

    matchArrowFunction() {
        const tokens = this.tokens;

        // Arrow arguments
        const arrowArguments = [];

        if (tokens.test(Types.LPAREN)) {
            // OPTION 1: Multiple arguments in parentheses, e.g. (value, key) => expression
            tokens.next(); // Consume the LPAREN

            while (!tokens.test(Types.EOF) && !tokens.test(Types.RPAREN)) {
                const arg = this.matchExpression(); // Adjust this line to match arguments properly
                arrowArguments.push(arg);
                if (tokens.test(Types.COMMA)) {
                    tokens.next(); // Consume the comma
                }
            }

            if (tokens.test(Types.RPAREN)) {
                tokens.next(); // Consume the RPAREN
            }
        } else {
            // OPTION 2: Single argument, e.g. item => expression
            const arg = this.matchExpression(); // Adjust this line to match arguments properly
            arrowArguments.push(arg);
        }

        // Skip arrow
        if (tokens.test(Types.ARROW)) {
            tokens.next();
        }

        // Body
        const arrowBody = this.matchExpression();

        const result = new n.ArrowFunction(
            arrowArguments,
            arrowBody.length === 1 ? arrowBody[0] : arrowBody // If single expression, return it directly
        );

        return result;
    }
}
