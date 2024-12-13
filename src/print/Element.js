import { doc } from "prettier";
import {
    removeSurroundingWhitespace,
    isInlineElement,
    isOwnlineElement,
    printChildGroups,
    EXPRESSION_NEEDED,
    STRING_NEEDS_QUOTES
} from "../util/index.js";

const { group, line, hardline, softline, indent, join } = doc.builders;

const printOpeningTag = (node, path, print, options) => {
    const groupId = Symbol("opening-tag");

    const opener = "<" + node.name;
    const printedAttributes = printSeparatedList(path, print, "", "attributes");

    const openingTagEnd = [];
    if (node.selfClosing) {
        if (!options.bracketSameLine) {
            openingTagEnd.push(line);
        } else {
            openingTagEnd.push(" ");
        }
        openingTagEnd.push("/>");
    } else {
        if (!options.bracketSameLine) {
            openingTagEnd.push(softline);
        }
        openingTagEnd.push(">");
    }

    const hasAttributes = node.attributes && node.attributes.length > 0;
    if (hasAttributes) {
        return group(
            [opener, indent([line, printedAttributes]), openingTagEnd],
            { id: groupId }
        );
    }

    return group([opener, openingTagEnd], { id: groupId });
};

const printSeparatedList = (path, print, separator, attrName) => {
    return join([separator, line], path.map(print, attrName));
};

const p = (node, path, print, options) => {
    // Set a flag in case attributes contain, e.g., a FilterExpression
    node[EXPRESSION_NEEDED] = true;
    const openingGroup = group(printOpeningTag(node, path, print, options));
    node[EXPRESSION_NEEDED] = false;
    node[STRING_NEEDS_QUOTES] = false;

    if (!node.selfClosing) {
        node.children = removeSurroundingWhitespace(node.children);

        const childGroups = printChildGroups(node, path, print, "children");
        const closingTag = ["</", node.name, ">"];
        const result = [openingGroup];
        const joinedChildren = childGroups;
        if (isOwnlineElement(node)) {
            result.push([joinedChildren]);
        } else if (isInlineElement(node)) {
            result.push(indent([softline, joinedChildren]), softline);
        } else {
            const childBlock = [];
            if (childGroups.length > 0) {
                childBlock.push(hardline);
            }
            childBlock.push(joinedChildren);
            result.push(indent(childBlock));
            if (childGroups.length > 0) {
                result.push(hardline);
            }
        }
        result.push(closingTag);

        return isInlineElement(node) ? group(result) : result;
    }

    return openingGroup;
};

export { p as printElement };
