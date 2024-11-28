import { doc } from "prettier";
import { Node } from "../melody/melody-types/index.js";
import {
    EXPRESSION_NEEDED,
    STRING_NEEDS_QUOTES,
    wrapExpressionIfNeeded
} from "../util/index.js";

const { group, softline, line, indent, join } = doc.builders;

const printCallExpression = (node, path, print) => {
    node[EXPRESSION_NEEDED] = false;
    node[STRING_NEEDS_QUOTES] = true;
    const mappedArguments = path.map(print, "arguments");
    const parts = [path.call(print, "callee"), "("];
    if (node.arguments.length === 0) {
        parts.push(")");
    } else if (
        node.arguments.length === 1 &&
        Node.isObjectExpression(node.arguments[0])
    ) {
        // Optimization: No line break between "(" and "{" if
        // there is exactly one object parameter
        parts.push(mappedArguments[0], ")");
    } else if (options.experimentalMethodChainIndentation) {
        parts.push(indent([join([","], mappedArguments)]), ")");
    } else {
        parts.push(
            indent([softline, join([",", line], mappedArguments)]),
            softline,
            ")"
        );
    }

    wrapExpressionIfNeeded(path, parts, node);

    return group(parts);
};

export { printCallExpression };
