import { doc } from "prettier";
import {
    EXPRESSION_NEEDED,
    STRING_NEEDS_QUOTES,
    wrapExpressionIfNeeded
} from "../util/index.js";

const { line, indent, group } = doc.builders;

const printConditionalExpression = (node, path, print) => {
    node[EXPRESSION_NEEDED] = false;
    node[STRING_NEEDS_QUOTES] = true;

    const rest = [line, "?"];
    if (node.consequent) {
        rest.push([" ", path.call(print, "consequent")]);
    }
    if (node.alternate) {
        rest.push(line, ": ", path.call(print, "alternate"));
    }
    const parts = [path.call(print, "test"), indent(rest)];
    wrapExpressionIfNeeded(path, parts, node);

    return group(parts);
};

export { printConditionalExpression };
