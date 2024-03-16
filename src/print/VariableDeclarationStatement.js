import prettier from 'prettier';
const { line, indent } = prettier.doc.builders;
import { STRING_NEEDS_QUOTES, isContractableNodeType } from '../util/index.js';

const p = (node, path, print) => {
    const printedName = path.call(print, "name");
    node[STRING_NEEDS_QUOTES] = true;
    const printedValue = path.call(print, "value");
    const shouldCondenseLayout = isContractableNodeType(node.value);
    const rightHandSide = shouldCondenseLayout
        ? [" ", printedValue]
        : indent([line, printedValue]);

    // We are explicitly not returning a group here, because
    // a VariableDeclarationStatement is - currently - always
    // embedded in a group created by SetStatement.
    return [printedName, " =", rightHandSide];
};

export default {
    printVariableDeclarationStatement: p
};
