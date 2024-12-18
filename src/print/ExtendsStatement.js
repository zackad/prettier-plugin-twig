import { STRING_NEEDS_QUOTES } from "../util/index.js";

const printExtendsStatement = (node, path, print) => {
    node[STRING_NEEDS_QUOTES] = true;
    return [
        node.trimLeft ? "{%-" : "{%",
        " extends ",
        path.call(print, "parentName"),
        node.trimRight ? " -%}" : " %}"
    ];
};

export { printExtendsStatement };
