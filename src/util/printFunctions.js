import { doc } from "prettier";
import { Node } from "../melody/melody-types/index.js";

const { line, indent, group } = doc.builders;

const noSpaceBeforeToken = {
    ",": true
};

const noSpaceAfterToken = {};

const printSingleTwigTag = (node, path, print) => {
    const opener = node.trimLeft ? "{%-" : "{%";
    const parts = [opener, " ", node.tagName];
    const printedParts = path.map(print, "parts");
    if (printedParts.length > 0) {
        parts.push(" ", printedParts[0]);
    }
    const indentedParts = [];
    for (let i = 1; i < node.parts.length; i++) {
        const part = node.parts[i];
        const prevPart = node.parts[i - 1];
        const isToken = Node.isGenericToken(part);
        const isPrevToken = Node.isGenericToken(prevPart);
        const noSpaceBefore = isToken && noSpaceBeforeToken[part.tokenText];
        const noSpaceAfter = isPrevToken && noSpaceAfterToken[prevPart.tokenText];
        const separator = noSpaceBefore || noSpaceAfter ? "" : line;
        indentedParts.push(separator, printedParts[i]);
    }
    if (node.parts.length > 1) {
        parts.push(indent(indentedParts));
    }
    const closing = node.trimRight ? "-%}" : "%}";
    parts.push(line, closing);
    return group(parts);
};

export { printSingleTwigTag };
