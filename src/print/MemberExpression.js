import { doc } from "prettier";
import {
    EXPRESSION_NEEDED,
    STRING_NEEDS_QUOTES,
    wrapExpressionIfNeeded
} from "../util/index.js";

const { group, softline, indent } = doc.builders;

const p = (node, path, print, options) => {
    node[EXPRESSION_NEEDED] = false;
    node[STRING_NEEDS_QUOTES] = true;
    const parts = [path.call(print, "object")];
    if (node.computed) {
        parts.push("[");
    } else if (options.experimentalMethodChainIndentation) {
        parts.push(indent([softline, "."]));
    } else {
        parts.push(".");
    }
    parts.push(path.call(print, "property"));
    if (node.computed) {
        parts.push("]");
    }
    wrapExpressionIfNeeded(path, parts, node);
    return group(parts);
};

export { p as printMemberExpression };
