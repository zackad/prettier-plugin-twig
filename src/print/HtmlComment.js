import { doc } from "prettier";
import {
    createTextGroups,
    stripHtmlCommentChars,
    normalizeHtmlComment,
    countNewlines
} from "../util/index.js";

const { join, indent, hardline } = doc.builders;

const p = (node, path, print) => {
    const commentText = stripHtmlCommentChars(node.value.value || "");

    const numNewlines = countNewlines(commentText);
    if (numNewlines === 0) {
        return normalizeHtmlComment(commentText);
    }

    return ["<!-- ", commentText, " -->"];
};

export { p as printHtmlComment };
