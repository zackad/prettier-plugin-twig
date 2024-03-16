import prettier from "prettier";
const { group } = prettier.doc.builders;
import {
    EXPRESSION_NEEDED,
    STRING_NEEDS_QUOTES,
    wrapExpressionIfNeeded
} from "../util/index.js";

const p = (node, path, print) => {
    node[EXPRESSION_NEEDED] = false;
    node[STRING_NEEDS_QUOTES] = true;
    const parts = [path.call(print, "object")];
    parts.push(node.computed ? "[" : ".");
    parts.push(path.call(print, "property"));
    if (node.computed) {
        parts.push("]");
    }
    wrapExpressionIfNeeded(path, parts, node);
    return group(parts);
};

export { p as printMemberExpression };
