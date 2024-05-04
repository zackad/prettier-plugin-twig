import { doc } from "prettier";
import { STRING_NEEDS_QUOTES, OVERRIDE_QUOTE_CHAR } from "../util/index.js";

const { fill, join } = doc.builders;

const p = (node, path, print) => {
    node[STRING_NEEDS_QUOTES] = true;
    node[OVERRIDE_QUOTE_CHAR] = '"';
    const start = "<!" + (node.declarationType || "").toUpperCase();
    const printedParts = path.map(print, "parts");

    return fill([start, " ", join(" ", printedParts), ">"]);
};

export { p as printDeclaration };
