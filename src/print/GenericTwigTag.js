import { doc } from "prettier";
import { Node } from "melody-types";
import {
    STRING_NEEDS_QUOTES,
    indentWithHardline,
    printSingleTwigTag,
    isEmptySequence
} from "../util/index.js";

const { hardline } = doc.builders;

const p = (node, path, print) => {
    node[STRING_NEEDS_QUOTES] = true;
    const openingTag = printSingleTwigTag(node, path, print);
    const parts = [openingTag];
    const printedSections = path.map(print, "sections");
    node.sections.forEach((section, i) => {
        if (Node.isGenericTwigTag(section)) {
            parts.push([hardline, printedSections[i]]);
        } else {
            if (!isEmptySequence(section)) {
                // Indent
                parts.push(indentWithHardline(printedSections[i]));
            }
        }
    });
    return parts;
};

export { p as printGenericTwigTag };
