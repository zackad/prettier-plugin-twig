import { doc } from "prettier";
import { Node } from "melody-types";
import {
    STRING_NEEDS_QUOTES,
    printSingleTwigTag,
    indentWithHardline,
    isEmptySequence
} from "../util/index.js";

const { indent, hardline } = doc.builders;

const p = (node, path, print) => {
    node[STRING_NEEDS_QUOTES] = true;
    const openingTag = printSingleTwigTag(node, path, print);
    const parts = [openingTag];
    const printedSections = path.map(print, "sections");
    node.sections.forEach((section, i) => {
        if (Node.isGenericTwigTag(section)) {
            if (section.tagName === "endswitch") {
                parts.push([hardline, printedSections[i]]);
            } else {
                parts.push(indentWithHardline(printedSections[i]));
            }
        } else {
            if (!isEmptySequence(section)) {
                // Indent twice
                parts.push(indent(indentWithHardline(printedSections[i])));
            }
        }
    });

    return parts;
};

export { p as printSwitchTag };
