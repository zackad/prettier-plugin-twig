import prettier from 'prettier';
const { hardline, group } = prettier.doc.builders;
import { printChildBlock } from '../util/index.js';

const p = (node, path, print) => {
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

export default {
    printSpacelessBlock: p
};
