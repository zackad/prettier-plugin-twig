import { doc } from "prettier";
import {
    EXPRESSION_NEEDED,
    STRING_NEEDS_QUOTES,
    wrapExpressionIfNeeded
} from "../util/index.js";

const { group } = doc.builders;

const printIdentifier = (node, path, print) => {
    node[EXPRESSION_NEEDED] = false;
    node[STRING_NEEDS_QUOTES] = true;

    const parts = [node.name];
    if (node.value !== undefined) {
        parts.push([" = ", path.call(print, "value")]);
    }

    wrapExpressionIfNeeded(path, parts, node);
    const result = parts;
    return parts.length === 1 ? result : group(result);
};

export { printIdentifier };
