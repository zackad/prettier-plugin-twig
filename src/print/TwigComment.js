import {
    parseTwigComment,
    unifyWhitespace,
    countNewlines
} from "../util/index.js";

const printTwigComment = node => {
    const originalText = node.value.value || "";
    const { text, open, close } = parseTwigComment(originalText);

    const numNewlines = countNewlines(text);
    if (numNewlines === 0) {
        return [open, " ", unifyWhitespace(text), " ", close];
    }

    return [open, text, close];
};

export { printTwigComment };
