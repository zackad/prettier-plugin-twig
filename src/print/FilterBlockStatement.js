import prettier from "prettier";
const { group, line, hardline } = prettier.doc.builders;
import { FILTER_BLOCK, printChildBlock } from "../util/index.js";

const printOpeningGroup = (node, path, print) => {
    const parts = [node.trimLeft ? "{%- " : "{% "];
    const printedExpression = path.call(print, "filterExpression");
    parts.push(printedExpression, line, node.trimRightFilter ? "-%}" : "%}");
    return group(parts);
};

const p = (node, path, print) => {
    node[FILTER_BLOCK] = true;
    const openingGroup = printOpeningGroup(node, path, print);
    const body = printChildBlock(node, path, print, "body");
    const closingStatement = [
        hardline,
        node.trimLeftEndfilter ? "{%-" : "{%",
        " endfilter ",
        node.trimRight ? "-%}" : "%}"
    ];

    return [openingGroup, body, closingStatement];
};

export { p as printFilterBlockStatement };
