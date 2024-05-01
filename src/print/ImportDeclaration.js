import { doc } from "prettier";
import { STRING_NEEDS_QUOTES } from "../util/index.js";

const { group, line, indent } = doc.builders;

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

export { p as printImportDeclaration };
