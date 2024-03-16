import prettier from 'prettier';
const { hardline } = prettier.doc.builders;
import { printChildBlock, quoteChar } from '../util/index.js';

const createOpener = (node, options) => {
    return [
        node.trimLeft ? "{%-" : "{%",
        " autoescape ",
        quoteChar(options),
        node.escapeType || "html",
        quoteChar(options),
        " ",
        node.trimRightAutoescape ? "-%}" : "%}"
    ];
};

const p = (node, path, print, options) => {
    const parts = [createOpener(node, options)];
    parts.push(printChildBlock(node, path, print, "expressions"));
    parts.push(
        hardline,
        node.trimLeftEndautoescape ? "{%-" : "{%",
        " endautoescape ",
        node.trimRight ? "-%}" : "%}"
    );

    return parts;
};

export {
    p as printAutoescapeBlock
};
