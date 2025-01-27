import { doc } from "prettier";
import {
    EXPRESSION_NEEDED,
    isWhitespaceNode,
    indentWithHardline
} from "../util/index.js";

const { group, indent, line, hardline } = doc.builders;

const printFor = (node, path, print) => {
    const parts = [node.trimLeft ? "{%-" : "{%", " for "];
    if (node.keyTarget) {
        parts.push(path.call(print, "keyTarget"), ", ");
    }
    parts.push(
        path.call(print, "valueTarget"),
        " in ",
        path.call(print, "sequence")
    );
    if (node.condition) {
        parts.push(indent([line, "if ", path.call(print, "condition")]));
    }
    parts.push([" ", node.trimRightFor ? "-%}" : "%}"]);
    return group(parts);
};

const printForStatement = (node, path, print) => {
    node[EXPRESSION_NEEDED] = false;
    const parts = [printFor(node, path, print)];
    const isBodyEmpty =
        node.body.expressions.length === 0 ||
        (node.body.expressions.length === 1 &&
            isWhitespaceNode(node.body.expressions[0]));
    const printedChildren = path.call(print, "body");
    if (!isBodyEmpty || node.otherwise) {
        parts.push(indentWithHardline(printedChildren));
    }
    if (node.otherwise) {
        parts.push(
            hardline,
            node.trimLeftElse ? "{%-" : "{%",
            " else ",
            node.trimRightElse ? "-%}" : "%}"
        );
        const printedOtherwise = path.call(print, "otherwise");
        parts.push(indentWithHardline(printedOtherwise));
    }
    parts.push(
        isBodyEmpty ? "" : hardline,
        node.trimLeftEndfor ? "{%-" : "{%",
        " endfor ",
        node.trimRight ? "-%}" : "%}"
    );

    return parts;
};

export { printForStatement };
