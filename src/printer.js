import { printSequenceExpression } from "./print/SequenceExpression.js";
import { printBinaryExpression } from "./print/BinaryExpression.js";
import { printConditionalExpression } from "./print/ConditionalExpression.js";
import { printElement } from "./print/Element.js";
import { printAttribute } from "./print/Attribute.js";
import { printIdentifier } from "./print/Identifier.js";
import { printExpressionStatement } from "./print/ExpressionStatement.js";
import { printMemberExpression } from "./print/MemberExpression.js";
import { printFilterExpression } from "./print/FilterExpression.js";
import { printArrowFunction } from "./print/ArrowFunction.js";
import { printObjectExpression } from "./print/ObjectExpression.js";
import { printObjectProperty } from "./print/ObjectProperty.js";
import { printCallExpression } from "./print/CallExpression.js";
import { printTestExpression } from "./print/TestExpression.js";
import { printUnaryExpression } from "./print/UnaryExpression.js";
import { printUnarySubclass } from "./print/UnarySubclass.js";
import { printTextStatement } from "./print/TextStatement.js";
import { printStringLiteral } from "./print/StringLiteral.js";
import { printArrayExpression } from "./print/ArrayExpression.js";
import { printSliceExpression } from "./print/SliceExpression.js";
import { printUseStatement } from "./print/UseStatement.js";
import { printAliasExpression } from "./print/AliasExpression.js";
import { printBlockStatement } from "./print/BlockStatement.js";
import { printSpacelessBlock } from "./print/SpacelessBlock.js";
import { printAutoescapeBlock } from "./print/AutoescapeBlock.js";
import { printFlushStatement } from "./print/FlushStatement.js";
import { printIncludeStatement } from "./print/IncludeStatement.js";
import { printIfStatement } from "./print/IfStatement.js";
import { printMountStatement } from "./print/MountStatement.js";
import { printForStatement } from "./print/ForStatement.js";
import { printSetStatement } from "./print/SetStatement.js";
import { printDoStatement } from "./print/DoStatement.js";
import { printExtendsStatement } from "./print/ExtendsStatement.js";
import { printEmbedStatement } from "./print/EmbedStatement.js";
import { printImportDeclaration } from "./print/ImportDeclaration.js";
import { printFromStatement } from "./print/FromStatement.js";
import { printTwigComment } from "./print/TwigComment.js";
import { printHtmlComment } from "./print/HtmlComment.js";
import { printDeclaration } from "./print/Declaration.js";
import { printGenericTwigTag } from "./print/GenericTwigTag.js";
import { printGenericToken } from "./print/GenericToken.js";
import { printMacroDeclarationStatement } from "./print/MacroDeclarationStatement.js";
import { printFilterBlockStatement } from "./print/FilterBlockStatement.js";
import { printVariableDeclarationStatement } from "./print/VariableDeclarationStatement.js";
import { printNamedArgumentExpression } from "./print/NamedArgumentExpression.js";
import { printSwitchTag } from "./print/SwitchTag.js";
import {
    isWhitespaceNode,
    isHtmlCommentEqualTo,
    isTwigCommentEqualTo
} from "./util/index.js";
import { ORIGINAL_SOURCE } from "./parser.js";

const printFunctions = {};

const isHtmlIgnoreNextComment = isHtmlCommentEqualTo("prettier-ignore");
const isHtmlIgnoreStartComment = isHtmlCommentEqualTo("prettier-ignore-start");
const isHtmlIgnoreEndComment = isHtmlCommentEqualTo("prettier-ignore-end");
const isTwigIgnoreNextComment = isTwigCommentEqualTo("prettier-ignore");
const isTwigIgnoreStartComment = isTwigCommentEqualTo("prettier-ignore-start");
const isTwigIgnoreEndComment = isTwigCommentEqualTo("prettier-ignore-end");

const isIgnoreNextComment = s =>
    isHtmlIgnoreNextComment(s) || isTwigIgnoreNextComment(s);
const isIgnoreRegionStartComment = s =>
    isHtmlIgnoreStartComment(s) || isTwigIgnoreStartComment(s);
const isIgnoreRegionEndComment = s =>
    isHtmlIgnoreEndComment(s) || isTwigIgnoreEndComment(s);

let originalSource = "";
let ignoreRegion = false;
let ignoreNext = false;

const checkForIgnoreStart = node => {
    // Keep current "ignoreNext" value if it's true,
    // but is not applied in this step yet
    ignoreNext =
        (ignoreNext && !shouldApplyIgnoreNext(node)) ||
        isIgnoreNextComment(node);
    ignoreRegion = ignoreRegion || isIgnoreRegionStartComment(node);
};

const checkForIgnoreEnd = node => {
    if (ignoreRegion && isIgnoreRegionEndComment(node)) {
        ignoreRegion = false;
    }
};

const shouldApplyIgnoreNext = node => !isWhitespaceNode(node);

const print = (path, options, print) => {
    const node = path.getValue();
    const nodeType = node.constructor.name;

    // Try to get the entire original source from AST root
    if (node[ORIGINAL_SOURCE]) {
        originalSource = node[ORIGINAL_SOURCE];
    }

    if (options.twigPrintWidth) {
        options.printWidth = options.twigPrintWidth;
    }

    checkForIgnoreEnd(node);
    const useOriginalSource =
        (shouldApplyIgnoreNext(node) && ignoreNext) || ignoreRegion;
    const hasPrintFunction = printFunctions[nodeType];

    // Happy path: We have a formatting function, and the user wants the
    // node formatted
    if (!useOriginalSource && hasPrintFunction) {
        checkForIgnoreStart(node);
        return printFunctions[nodeType](node, path, print, options);
    } else if (!hasPrintFunction) {
        console.warn(`No print function available for node type "${nodeType}"`);
    }

    checkForIgnoreStart(node);

    // Fallback: Use the node's loc property with the
    // originalSource property on the AST root
    if (canGetSubstringForNode(node)) {
        return getSubstringForNode(node);
    }

    return "";
};

const getSubstringForNode = node =>
    originalSource.substring(node.loc.start.index, node.loc.end.index);

const canGetSubstringForNode = node =>
    originalSource &&
    node.loc &&
    node.loc.start &&
    node.loc.end &&
    node.loc.start.index &&
    node.loc.end.index;
/**
 * Prettier printing works with a so-called FastPath object, which is
 * passed into many of the following methods through a "path" argument.
 * This is basically a stack, and the way to do do recursion in Prettier
 * is through this path object.
 *
 * For example, you might expect to write something like this:
 *
 * BinaryExpression.prototype.prettyPrint = _ => {
 *     return concat([
 *         this.left.prettyPrint(),
 *         " ",
 *         this.operator,
 *         " ",
 *         this.right.prettyPrint()
 *     ]);
 * };
 *
 * Here, the prettyPrint() method of BinaryExpression calls the prettyPrint()
 * methods of the left and right operands. However, it actually has to be
 * done like this in Prettier plugins:
 *
 * BinaryExpression.prototype.prettyPrint = (path, print) => {
 *     const docs = [
 *         path.call(print, "left"),
 *         " ",
 *         this.operator,
 *         " ",
 *         path.call(print, "right")
 *     ];
 *     return concat(docs);
 * };
 *
 * The first argument to path.call() seems to always be the print function
 * that is passed in (a case of bad interface design and over-complication?),
 * at least I have not found any other instance. The arguments after that are
 * field names that are pulled from the node and put on the stack for the
 * next processing step(s) => this is how recursion is done.
 *
 */

printFunctions["SequenceExpression"] = printSequenceExpression;
printFunctions["ConstantValue"] = node => {
    return node.value;
};
printFunctions["StringLiteral"] = printStringLiteral;
printFunctions["Identifier"] = printIdentifier;
printFunctions["UnaryExpression"] = printUnaryExpression;
printFunctions["BinaryExpression"] = printBinaryExpression;
printFunctions["BinarySubclass"] = printBinaryExpression;
printFunctions["UnarySubclass"] = printUnarySubclass;
printFunctions["TestExpression"] = printTestExpression;
printFunctions["ConditionalExpression"] = printConditionalExpression;
printFunctions["Element"] = printElement;
printFunctions["Attribute"] = printAttribute;
printFunctions["PrintTextStatement"] = printTextStatement;
printFunctions["PrintExpressionStatement"] = printExpressionStatement;
printFunctions["MemberExpression"] = printMemberExpression;
printFunctions["FilterExpression"] = printFilterExpression;
printFunctions["ArrowFunction"] = printArrowFunction;
printFunctions["ObjectExpression"] = printObjectExpression;
printFunctions["ObjectProperty"] = printObjectProperty;

// Return value has to be a string
const returnNodeValue = node => "" + node.value;

printFunctions["Fragment"] = (node, path, print) => {
    return path.call(print, "value");
};
printFunctions["switchTag"] = printSwitchTag;
printFunctions["NumericLiteral"] = returnNodeValue;
printFunctions["BooleanLiteral"] = returnNodeValue;
printFunctions["NullLiteral"] = () => "null";
printFunctions["ArrayExpression"] = printArrayExpression;
printFunctions["CallExpression"] = printCallExpression;
printFunctions["NamedArgumentExpression"] = printNamedArgumentExpression;
printFunctions["SliceExpression"] = printSliceExpression;
printFunctions["UseStatement"] = printUseStatement;
printFunctions["AliasExpression"] = printAliasExpression;
printFunctions["BlockStatement"] = printBlockStatement;
printFunctions["SpacelessBlock"] = printSpacelessBlock;
printFunctions["AutoescapeBlock"] = printAutoescapeBlock;
printFunctions["FlushStatement"] = printFlushStatement;
printFunctions["IncludeStatement"] = printIncludeStatement;
printFunctions["IfStatement"] = printIfStatement;
printFunctions["MountStatement"] = printMountStatement;
printFunctions["ForStatement"] = printForStatement;
printFunctions["BinaryConcatExpression"] = printBinaryExpression;
printFunctions["SetStatement"] = printSetStatement;
printFunctions["VariableDeclarationStatement"] =
    printVariableDeclarationStatement;
printFunctions["DoStatement"] = printDoStatement;
printFunctions["ExtendsStatement"] = printExtendsStatement;
printFunctions["EmbedStatement"] = printEmbedStatement;
printFunctions["FilterBlockStatement"] = printFilterBlockStatement;
printFunctions["ImportDeclaration"] = printImportDeclaration;
printFunctions["FromStatement"] = printFromStatement;
printFunctions["MacroDeclarationStatement"] = printMacroDeclarationStatement;
printFunctions["TwigComment"] = printTwigComment;
printFunctions["HtmlComment"] = printHtmlComment;
printFunctions["Declaration"] = printDeclaration;
printFunctions["GenericTwigTag"] = (node, path, print, options) => {
    const tagName = node.tagName;
    if (printFunctions[tagName + "Tag"]) {
        // Give the user the chance to implement a custom
        // print function for certain generic Twig tags
        return printFunctions[tagName + "Tag"](node, path, print, options);
    }
    return printGenericTwigTag(node, path, print, options);
};
printFunctions["GenericToken"] = printGenericToken;

// Fallbacks
printFunctions["String"] = s => s;

export { print };
