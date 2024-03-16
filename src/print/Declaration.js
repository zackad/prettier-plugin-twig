import prettier from 'prettier';
const { fill, join } = prettier.doc.builders;
import { STRING_NEEDS_QUOTES, OVERRIDE_QUOTE_CHAR } from '../util/index.js';

const p = (node, path, print) => {
    node[STRING_NEEDS_QUOTES] = true;
    node[OVERRIDE_QUOTE_CHAR] = '"';
    const start = "<!" + (node.declarationType || "").toUpperCase();
    const printedParts = path.map(print, "parts");

    return fill([start, " ", join(" ", printedParts), ">"]);
};

export {
    p as printDeclaration
};
