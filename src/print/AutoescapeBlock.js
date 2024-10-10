import { doc } from "prettier";
import isBoolean from "lodash/isBoolean.js";
import { printChildBlock, quoteChar } from "../util/index.js";

const { hardline } = doc.builders;

const printEscapeType = (escapeType, options) => {
    if (escapeType === null) {
        return [];
    }

    if (isBoolean(escapeType)) {
        return [escapeType ? "true" : "false", " "];
    }

    return [quoteChar(options), escapeType, quoteChar(options), " "];
};

const createOpener = (node, options) => {
    return [
        node.trimLeft ? "{%-" : "{%",
        " autoescape ",
        ...printEscapeType(node.escapeType, options),
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
