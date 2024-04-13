import prettier from "prettier";
const { group, line, hardline, indent, join } = prettier.doc.builders;
import { EXPRESSION_NEEDED, wrapExpressionIfNeeded } from "../util/index.js";

const p = (node, path, print, options) => {
    if (node.properties.length === 0) {
        return "{}";
    }
    node[EXPRESSION_NEEDED] = false;
    const mappedElements = path.map(print, "properties");
    const separator = options.twigAlwaysBreakObjects ? hardline : line;
    const indentedContent = [line, join([",", separator], mappedElements)];

    const parts = ["{", indent(indentedContent), separator, "}"];
    wrapExpressionIfNeeded(path, parts, node);

    return group(parts);
};

export { p as printObjectExpression };
