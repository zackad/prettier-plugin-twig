import {
    firstValueInAncestorChain,
    quoteChar,
    STRING_NEEDS_QUOTES,
    OVERRIDE_QUOTE_CHAR,
    INSIDE_OF_STRING
} from "../util/index.js";

/**
 * Lists the quote characters of a string literal value that are not
 * part of an escape sequence (a backslash escapes the next character)
 */
const unescapedQuotes = s => {
    const quotes = new Set();
    for (let i = 0; i < s.length; i++) {
        if (s[i] === "\\") {
            i++;
        } else if (s[i] === "'" || s[i] === '"') {
            quotes.add(s[i]);
        }
    }
    return quotes;
};

/**
 * Escapes the occurrences of the given quote character that are not
 * already part of an escape sequence
 */
const escapeQuotes = (s, quote) => {
    let result = "";
    for (let i = 0; i < s.length; i++) {
        if (s[i] === "\\") {
            result += s.slice(i, i + 2);
            i++;
        } else {
            result += s[i] === quote ? "\\" + quote : s[i];
        }
    }
    return result;
};

const alternate = quote => (quote === '"' ? "'" : '"');

const getQuoteChar = (s, options) => {
    const preferred = quoteChar(options);
    const quotes = unescapedQuotes(s);
    if (quotes.has(preferred) && !quotes.has(alternate(preferred))) {
        return alternate(preferred);
    }
    return preferred;
};

/**
 * Whether the string literal is a fragment of an interpolated
 * string ("... #{ expr } ..."), which is always double quoted
 */
const isInterpolatedStringFragment = path => {
    for (let i = path.stack.length - 2; i >= 0; i--) {
        const element = path.stack[i];
        if (element && element[STRING_NEEDS_QUOTES] !== undefined) {
            return element[INSIDE_OF_STRING] === true;
        }
    }
    return false;
};

const printStringLiteral = (node, path, print, options) => {
    // The structure this string literal is part of
    // determines if we need quotes or not
    const needsQuotes = firstValueInAncestorChain(
        path,
        STRING_NEEDS_QUOTES,
        false
    );
    // In case of a string with interpolations, only double quotes
    // are allowed. This is then indicated by OVERRIDE_QUOTE_CHAR
    // in an ancestor.
    const overridingQuoteChar = firstValueInAncestorChain(
        path,
        OVERRIDE_QUOTE_CHAR,
        null
    );

    if (needsQuotes) {
        const quote = overridingQuoteChar
            ? overridingQuoteChar
            : getQuoteChar(node.value, options);
        return quote + escapeQuotes(node.value, quote) + quote;
    }

    if (isInterpolatedStringFragment(path)) {
        return escapeQuotes(node.value, '"');
    }

    return node.value;
};

export { printStringLiteral };
