import { doc } from "prettier";
import { STRING_NEEDS_QUOTES } from "../util/index.js";

const { group, softline, line, indent, join } = doc.builders;

const printArrayExpression = (node, path, print) => {
    node[STRING_NEEDS_QUOTES] = true;
    const mappedElements = path.map(print, "elements");
    const indentedContent = [softline, join([",", line], mappedElements)];

    return group(["[", indent(indentedContent), softline, "]"]);
};

export { printArrayExpression };
