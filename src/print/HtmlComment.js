import prettier from "prettier";
const { join, indent, hardline } = prettier.doc.builders;

import {
    createTextGroups,
    stripHtmlCommentChars,
    normalizeHtmlComment,
    countNewlines
} from "../util/index.js";

const p = (node, path, print) => {
    const commentText = stripHtmlCommentChars(node.value.value || "");

    const numNewlines = countNewlines(commentText);
    if (numNewlines === 0) {
        return normalizeHtmlComment(commentText);
    }

    return ["<!-- ", commentText, " -->"];
};

export { p as printHtmlComment };
