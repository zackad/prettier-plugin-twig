import { doc } from "prettier";
import { STRING_NEEDS_QUOTES } from "../util/index.js";

const { group, join, line, indent } = doc.builders;

const printImportDeclaration = node => {
    const parts = [node.key.name];
    if (node.key.name !== node.alias.name) {
        parts.push(" as ", node.alias.name);
    }
    return parts;
};

const printFromStatement = (node, path, print) => {
    node[STRING_NEEDS_QUOTES] = true;
    // Unfortunately, ImportDeclaration has different
    // formatting needs here compared to when used
    // standalone. Therefore, we collect them manually.
    const mappedImports = node.imports.map(printImportDeclaration);
    const indentedParts = indent([line, join([",", line], mappedImports)]);
    return group([
        node.trimLeft ? "{%-" : "{%",
        " from ",
        path.call(print, "source"),
        " import",
        indentedParts,
        line,
        node.trimRight ? "-%}" : "%}"
    ]);
};

export { printFromStatement };
