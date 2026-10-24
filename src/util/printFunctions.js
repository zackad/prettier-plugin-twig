import { doc } from "prettier";
import { Node } from "../melody/melody-types/index.js";

const { line, indent, group, hardline, join, lineSuffix, breakParent } =
    doc.builders;

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

const hasLeadingComments = node =>
    !!node &&
    Array.isArray(node.leadingComments) &&
    node.leadingComments.length > 0;

const hasTrailingComments = node =>
    !!node &&
    Array.isArray(node.trailingComments) &&
    node.trailingComments.length > 0;

const hasComments = node =>
    hasLeadingComments(node) || hasTrailingComments(node);

// Own group, so the line breaks forced by the comments do not break the node itself
const printComments = (node, printed) => {
    if (!hasComments(node)) {
        return printed;
    }
    const parts = [];
    if (hasLeadingComments(node)) {
        parts.push(join(hardline, node.leadingComments), hardline);
    }
    parts.push(group(printed));
    if (hasTrailingComments(node)) {
        parts.push(
            lineSuffix([" ", join(" ", node.trailingComments)]),
            breakParent
        );
    }
    return parts;
};

export {
    printSingleTwigTag,
    printComments,
    hasLeadingComments,
    hasTrailingComments,
    hasComments
};
