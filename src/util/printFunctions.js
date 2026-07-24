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

    const groupedNodes = [];
    const groupedDocs = [];
    for (let i = 0; i < node.parts.length; i++) {
        const equalsToken = node.parts[i + 1];
        const isAssignment =
            Node.isGenericToken(equalsToken) &&
            equalsToken.tokenText === "=" &&
            node.parts[i + 2] !== undefined;
        if (isAssignment) {
            groupedNodes.push(node.parts[i]);
            groupedDocs.push([printedParts[i], " = ", printedParts[i + 2]]);
            i += 2;
        } else {
            groupedNodes.push(node.parts[i]);
            groupedDocs.push(printedParts[i]);
        }
    }

    if (groupedDocs.length > 0) {
        parts.push(" ", groupedDocs[0]);
    }
    const indentedParts = [];
    for (let i = 1; i < groupedDocs.length; i++) {
        const part = groupedNodes[i];
        const prevPart = groupedNodes[i - 1];
        const isToken = Node.isGenericToken(part);
        const isPrevToken = Node.isGenericToken(prevPart);
        const noSpaceBefore = isToken && noSpaceBeforeToken[part.tokenText];
        const noSpaceAfter =
            isPrevToken && noSpaceAfterToken[prevPart.tokenText];
        const separator = noSpaceBefore || noSpaceAfter ? "" : line;
        indentedParts.push(separator, groupedDocs[i]);
    }
    if (groupedDocs.length > 1) {
        parts.push(indent(indentedParts));
    }
    const closing = node.trimRight ? "-%}" : "%}";
    parts.push(line, closing);
    return group(parts);
};

export { printSingleTwigTag };
