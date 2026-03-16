import {
    TypesDeclarationStatement,
    TypesVariableDeclaration
} from "../types.js";
import {
    createNode,
    setEndFromToken,
    setStartFromToken,
    Types
} from "../../melody-parser/index.js";
import { Identifier, StringLiteral } from "../../melody-types/index.js";

/**
 * @typedef {import('../../melody-parser/Parser.js').Parser} Parser
 */

/**
 * @typedef {import('../../melody-parser/TokenStream.js').TokenStream} TokenStream
 */

/**
 * @typedef {import('../../melody-types/index.js').Node} Node
 */

export const TypesParser = {
    name: "types",
    /**
     * @param  {Parser} parser
     * @param  {Node}   token
     * @return {TypesDeclarationStatement}
     */
    parse(parser, token) {
        const tokens = parser.tokens;

        const typesStatement = new TypesDeclarationStatement();
        typesStatement.enclosed = !!tokens.nextIf(Types.LBRACKET);

        while (
            !tokens.test(Types.RBRACKET) &&
            !tokens.test(Types.TAG_END) &&
            !tokens.test(Types.EOF)
        ) {
            const nameToken = tokens.expect(Types.SYMBOL);
            const nameNode = createNode(Identifier, nameToken, nameToken.text);

            const isVariableOptional = !!tokens.nextIf(Types.QUESTION_MARK);

            tokens.expect(Types.COLON);
            const valueNode = matchLiteralStringExpression(tokens);
            if (valueNode === false) {
                parser.error({
                    title: "types declaration must be a string",
                    pos: tokens.la(0).pos,
                    advice: `The variable declaration for types must be a string.`
                });
            }

            const varType = new TypesVariableDeclaration(nameNode, valueNode);
            varType.optional = isVariableOptional;
            typesStatement.declarations.push(varType);

            tokens.nextIf(Types.COMMA);
        }

        if (typesStatement.enclosed) {
            tokens.expect(Types.RBRACKET);
        }

        setStartFromToken(typesStatement, token);
        setEndFromToken(typesStatement, tokens.expect(Types.TAG_END));
        return typesStatement;
    }
};

/**
 * @param  {TokenStream} tokens
 * @return {StringLiteral|false}
 */
function matchLiteralStringExpression(tokens) {
    const stringStartToken = tokens.nextIf(Types.STRING_START);
    if (!stringStartToken) {
        return false;
    }

    const valueToken = tokens.expect(Types.STRING);
    if (!tokens.nextIf(Types.STRING_END)) {
        return false;
    }

    return createNode(StringLiteral, valueToken, valueToken.text);
}
