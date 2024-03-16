import {
    createTextGroups,
    stripTwigCommentChars,
    normalizeTwigComment,
    countNewlines,
} from '../util/index.js';

const p = node => {
    const originalText = node.value.value || "";
    const commentText = stripTwigCommentChars(originalText);
    const trimLeft = originalText.length >= 3 ? originalText[2] === "-" : false;
    const trimRight =
        originalText.length >= 3 ? originalText.slice(-3, -2) === "-" : false;

    const numNewlines = countNewlines(commentText);
    if (numNewlines === 0) {
        return normalizeTwigComment(commentText, trimLeft, trimRight);
    }

    return [trimLeft ? "{#-" : "{#", commentText, trimRight ? "-#}" : "#}"];
};

export default {
    printTwigComment: p
};
