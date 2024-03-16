import prettier from "prettier";
const { group, softline, line, indent, join } = prettier.doc.builders;
import { STRING_NEEDS_QUOTES } from "../util/index.js";

const p = (node, path, print) => {
    node[STRING_NEEDS_QUOTES] = true;
    const mappedElements = path.map(print, "elements");
    const indentedContent = [softline, join([",", line], mappedElements)];

    return group(["[", indent(indentedContent), softline, "]"]);
};

export { p as printArrayExpression };
