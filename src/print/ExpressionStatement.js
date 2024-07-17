import { doc } from "prettier";
import { Node } from "../melody/melody-types/index.js";
import {
    EXPRESSION_NEEDED,
    STRING_NEEDS_QUOTES,
    isContractableNodeType
} from "../util/index.js";

const { group, indent, line } = doc.builders;

const p = (node, path, print) => {
    node[EXPRESSION_NEEDED] = false;
    node[STRING_NEEDS_QUOTES] = true;
    const opener = node.trimLeft ? "{{-" : "{{";
    const closing = node.trimRight ? "-}}" : "}}";
    const shouldContractValue =
        isContractableNodeType(node.value) &&
        !Node.isObjectExpression(node.value);
    const padding = shouldContractValue ? " " : line;
    const printedValue = [padding, path.call(print, "value")];
    const value = shouldContractValue ? printedValue : indent(printedValue);
    return group([opener, value, padding, closing]);
};

export { p as printExpressionStatement };
