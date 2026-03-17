import { doc } from "prettier";

const { group, join, line, indentIfBreak, hardline, softline } = doc.builders;

/**
 * @typedef {import('../melody/melody-extension-core/types.js').TypesDeclarationStatement} TypesDeclarationStatement
 */

/**
 * The `{% types %}` tag node printer.
 *
 * Introduced in Twig version 3.13.
 *
 * @param {TypesDeclarationStatement} node
 */
const printTypesDeclarationStatement = (node, path, print) => {
    const typesGroupId = Symbol("types-declarations");

    const mappedTypes = path.map(print, "declarations");
    const joinedTypes = join([",", line], mappedTypes);
    const hasManyTypes = node.declarations.length > 1 ? hardline : softline;

    const parts = [node.trimLeft ? "{%-" : "{%", " types "];

    if (node.enclosed) {
        parts.push("{");
    }

    parts.push(
        indentIfBreak([hasManyTypes, joinedTypes], { groupId: typesGroupId }),
        line
    );

    if (node.enclosed) {
        parts.push("}", " ");
    }

    parts.push(node.trimRight ? "-%}" : "%}");

    return group(parts, { id: typesGroupId });
};

export { printTypesDeclarationStatement };
