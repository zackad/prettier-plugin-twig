import { doc } from "prettier";
import {
    EXPRESSION_NEEDED,
    STRING_NEEDS_QUOTES,
    wrapExpressionIfNeeded
} from "../util/index.js";

const { group } = doc.builders;

const printUnaryExpression = (node, path, print) => {
    node[EXPRESSION_NEEDED] = false;
    node[STRING_NEEDS_QUOTES] = true;
    const parts = [node.operator, path.call(print, "argument")];
    wrapExpressionIfNeeded(path, parts, node);
    return group(parts);
};

export { printUnaryExpression };
