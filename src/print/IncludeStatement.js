import { doc } from "prettier";
import { STRING_NEEDS_QUOTES } from "../util/index.js";

const { group } = doc.builders;

const printIncludeStatement = (node, path, print) => {
    node[STRING_NEEDS_QUOTES] = true;
    const parts = [
        node.trimLeft ? "{%-" : "{%",
        " include ",
        path.call(print, "source")
    ];
    if (node.argument) {
        const printedArguments = path.call(print, "argument");
        parts.push(" with ");
        parts.push(printedArguments);
    }

    if (node.contextFree) {
        parts.push(" only");
    }
    parts.push(node.trimRight ? " -%}" : " %}");
    return group(parts);
};

export { printIncludeStatement };
