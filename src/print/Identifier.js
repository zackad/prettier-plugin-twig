import prettier from 'prettier';
const { group } = prettier.doc.builders;
import { EXPRESSION_NEEDED, wrapExpressionIfNeeded } from '../util/index.js';

const p = (node, path) => {
    node[EXPRESSION_NEEDED] = false;

    const parts = [node.name];
    wrapExpressionIfNeeded(path, parts, node);
    const result = parts;
    return parts.length === 1 ? result : group(result);
};

export {
    p as printIdentifier
};
