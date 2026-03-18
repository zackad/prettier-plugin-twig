import { doc } from "prettier";
import { STRING_NEEDS_QUOTES } from "../util/index.js";

const { group } = doc.builders;

/**
 * @typedef {import('../melody/melody-extension-core/types.js').TypesVariableDeclaration} TypesVariableDeclaration
 */

/**
 * The `{% types foo?: 'string' %}` variable type node printer.
 *
 * Introduced in Twig version 3.13.
 *
 * @param {TypesVariableDeclaration} node
 */
const printTypesVariableDeclaration = (node, path, print) => {
    const printedName = path.call(print, "name");
    const printedAssignment = node.optional ? "?: " : ": ";

    node[STRING_NEEDS_QUOTES] = true;
    const printedValue = path.call(print, "value");

    return group([printedName, [printedAssignment, printedValue]]);
};

export { printTypesVariableDeclaration };
