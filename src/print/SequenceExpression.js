import prettier from 'prettier';
const { hardline } = prettier.doc.builders;

import {
    removeSurroundingWhitespace,
    printChildGroups,
    isRootNode,
    STRING_NEEDS_QUOTES,
} from '../util/index.js';

const p = (node, path, print) => {
    node[STRING_NEEDS_QUOTES] = false;
    node.expressions = removeSurroundingWhitespace(node.expressions);
    const items = printChildGroups(node, path, print, "expressions");
    if (isRootNode(path)) {
        return [...items, hardline];
    }
    return items;
};

export {
    p as printSequenceExpression
};
