import prettier from 'prettier';
const { group, line, indent } = prettier.doc.builders;
import { STRING_NEEDS_QUOTES } from '../util/index.js';

const p = (node, path, print) => {
    node[STRING_NEEDS_QUOTES] = true;
    return group([
        node.trimLeft ? "{%-" : "{%",
        " import ",
        path.call(print, "key"),
        indent([line, "as ", path.call(print, "alias")]),
        line,
        node.trimRight ? "-%}" : "%}"
    ]);
};

export default {
    printImportDeclaration: p
};
