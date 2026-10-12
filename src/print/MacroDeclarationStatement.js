import { doc } from "prettier";
import { hasTrailingComments } from "../util/index.js";

const { group, join, line, softline, hardline, indent } = doc.builders;

const printOpener = (node, path, print) => {
    const parts = [
        node.trimLeft ? "{%-" : "{%",
        " macro ",
        path.call(print, "name"),
        "("
    ];
    const mappedArguments = path.map(print, "arguments");
    const joinedArguments = join([",", line], mappedArguments);
    parts.push(indent([softline, joinedArguments]));
    // The closing parenthesis must not end up in a trailing comment
    if (hasTrailingComments(node.arguments[node.arguments.length - 1])) {
        parts.push(softline);
    }
    parts.push(")", line, node.trimRightMacro ? "-%}" : "%}");
    return group(parts);
};

const printMacroDeclarationStatement = (node, path, print) => {
    const parts = [printOpener(node, path, print)];
    parts.push(indent([hardline, path.call(print, "body")]));
    parts.push(
        hardline,
        node.trimLeftEndmacro ? "{%-" : "{%",
        " endmacro ",
        node.trimRight ? "-%}" : "%}"
    );
    return parts;
};

export { printMacroDeclarationStatement };
