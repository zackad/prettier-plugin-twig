import { doc } from "prettier";
import { printChildBlock } from "../util/index.js";

const { hardline, group } = doc.builders;

const printSpacelessBlock = (node, path, print) => {
    const parts = [
        node.trimLeft ? "{%-" : "{%",
        " spaceless ",
        node.trimRightSpaceless ? "-%}" : "%}"
    ];
    parts.push(printChildBlock(node, path, print, "body"));
    parts.push(hardline);
    parts.push(
        node.trimLeftEndspaceless ? "{%-" : "{%",
        " endspaceless ",
        node.trimRight ? "-%}" : "%}"
    );
    const result = group(parts);
    return result;
};

export { printSpacelessBlock };
