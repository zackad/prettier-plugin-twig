import { doc } from "prettier";
import { EXPRESSION_NEEDED, STRING_NEEDS_QUOTES } from "../util/index.js";

const { group, indent, join, line } = doc.builders;

const printPropItem = (node, path, print) => {
    node[EXPRESSION_NEEDED] = false;
    node[STRING_NEEDS_QUOTES] = true;

    const docs = [path.call(print, "name")];
    if (node.value !== undefined) {
        docs.push([" = ", path.call(print, "value")]);
    }

    return group(docs);
};

export { printPropItem };
