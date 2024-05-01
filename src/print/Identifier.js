import { doc } from "prettier";
import { EXPRESSION_NEEDED, wrapExpressionIfNeeded } from "../util/index.js";

const { group } = doc.builders;

const p = (node, path) => {
    node[EXPRESSION_NEEDED] = false;

    const parts = [node.name];
    wrapExpressionIfNeeded(path, parts, node);
    const result = parts;
    return parts.length === 1 ? result : group(result);
};

export { p as printIdentifier };
