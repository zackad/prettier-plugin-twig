import { doc } from "prettier";
import { Node, StringLiteral } from "../melody/melody-types/index.js";
import {
    printChildBlock,
    EXPRESSION_NEEDED,
    STRING_NEEDS_QUOTES
} from "../util/index.js";

const { hardline, group } = doc.builders;

const p = (node, path, print, options) => {
    node[EXPRESSION_NEEDED] = false;
    const hasChildren = Array.isArray(node.body);
    const printEndblockName = options.twigOutputEndblockName === true;

    if (hasChildren) {
        const blockName = path.call(print, "name");
        const opener = [
            node.trimLeft ? "{%-" : "{%",
            " block ",
            blockName,
            node.trimRightBlock ? " -%}" : " %}"
        ];
        const parts = [opener];

        if (node.body.length === 0) {
            parts.push(hardline);
        }

        if (node.body.length > 0) {
            const indentedBody = printChildBlock(node, path, print, "body");
            parts.push(indentedBody);
        }
        parts.push(hardline);
        parts.push(
            node.trimLeftEndblock ? "{%-" : "{%",
            " endblock",
            printEndblockName ? [" ", blockName] : "",
            node.trimRight ? " -%}" : " %}"
        );

        return group(parts);
    } else if (Node.isPrintExpressionStatement(node.body)) {
        if (node.body.value instanceof StringLiteral) {
            node[STRING_NEEDS_QUOTES] = true;
        }
        return [
            node.trimLeft ? "{%-" : "{%",
            " block ",
            path.call(print, "name"),
            " ",
            path.call(print, "body", "value"),
            node.trimRight ? " -%}" : " %}"
        ];
    }
};

export { p as printBlockStatement };
