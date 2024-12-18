import { Node } from "../melody/melody-types/index.js";
import { isValidIdentifierName, STRING_NEEDS_QUOTES } from "../util/index.js";

const printObjectProperty = (node, path, print, options) => {
    node[STRING_NEEDS_QUOTES] =
        !node.computed &&
        Node.isStringLiteral(node.key) &&
        !isValidIdentifierName(node.key.value);
    const shouldPrintKeyAsString = node.key?.wasImplicitConcatenation;
    const needsParentheses = node.computed && !shouldPrintKeyAsString;
    const parts = [];

    // print "key" part if they exist
    if (node.key !== null) {
        if (needsParentheses) {
            parts.push("(");
        }
        parts.push(path.call(print, "key"));
        if (needsParentheses) {
            parts.push(")");
        }
        parts.push(": ");
    }

    // print "value" part
    node[STRING_NEEDS_QUOTES] = true;
    parts.push(path.call(print, "value"));
    return parts;
};

export { printObjectProperty };
