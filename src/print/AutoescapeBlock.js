import { doc } from "prettier";
import { printChildBlock, quoteChar } from "../util/index.js";

const { hardline } = doc.builders;

const createOpener = (node, options) => {
    return [
        node.trimLeft ? "{%-" : "{%",
        " autoescape ",
        quoteChar(options),
        node.escapeType || "html",
        quoteChar(options),
        " ",
        node.trimRightAutoescape ? "-%}" : "%}"
    ];
};

const p = (node, path, print, options) => {
    const parts = [createOpener(node, options)];
    parts.push(printChildBlock(node, path, print, "expressions"));
    parts.push(
        hardline,
        node.trimLeftEndautoescape ? "{%-" : "{%",
        " endautoescape ",
        node.trimRight ? "-%}" : "%}"
    );

    return parts;
};

export { p as printAutoescapeBlock };
