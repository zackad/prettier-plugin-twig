import { doc } from "prettier";
import {
    removeSurroundingWhitespace,
    printChildGroups,
    isRootNode,
    STRING_NEEDS_QUOTES
} from "../util/index.js";

const { hardline } = doc.builders;

const p = (node, path, print) => {
    node[STRING_NEEDS_QUOTES] = false;
    node.expressions = removeSurroundingWhitespace(node.expressions);
    const items = printChildGroups(node, path, print, "expressions");
    if (isRootNode(path)) {
        return [...items, hardline];
    }
    return items;
};

export { p as printSequenceExpression };
