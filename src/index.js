import { print } from "./printer.js";
import { parse } from "./parser.js";
import * as symbols from "./util/publicSymbols.js";
import * as publicFunctions from "./util/publicFunctions.js";

/**
 * @typedef {import('prettier').SupportLanguage} SupportLanguage
 *
 * @type {Partial<SupportLanguage>[]}
 */
const languages = [
    {
        name: "twig",
        parsers: ["twig"],
        extensions: [".html.twig", ".twig"]
    }
];

/**
 * @typedef {import('prettier').Parser} Parser
 *
 * @type Record<string, Parser>
 */
const parsers = {
    twig: {
        parse,
        astFormat: "twig",
        hasPragma() {
            return false;
        },
        locStart() {
            return -1;
        },
        locEnd() {
            return -1;
        }
    }
};

/**
 * @typedef {import('prettier').Printer} Printer
 *
 * @type Record<string, Printer>
 */
const printers = {
    twig: {
        print,
        printComment(commentPath) {
            const comment = commentPath.getValue();

            switch (comment.ast_type) {
                case "comment":
                    return comment.value;
                default:
                    throw new Error(
                        "Not a comment: " + JSON.stringify(comment)
                    );
            }
        },
        canAttachComment(node) {
            return node.ast_type && node.ast_type !== "comment";
        },
        massageAstNode(ast, newObj) {
            delete newObj.lineno;
            delete newObj.col_offset;
        },
        willPrintOwnComments() {
            return true;
        }
    }
};

/** @type {import('prettier').Options} Options */
const options = {
    twigTestExpressions: {
        type: "path",
        category: "Global",
        array: true,
        default: [{ value: [] }],
        description: "Make custom Twig tests known to the parser."
    },
    twigMultiTags: {
        type: "path",
        category: "Global",
        array: true,
        default: [{ value: [] }],
        description: "Make custom Twig tags known to the parser."
    },
    twigSingleQuote: {
        type: "boolean",
        category: "Global",
        default: true,
        description: "Use single quotes in Twig files?"
    },
    twigAlwaysBreakObjects: {
        type: "boolean",
        category: "Global",
        default: true,
        description: "Should objects always break in Twig files?"
    },
    twigFollowOfficialCodingStandards: {
        type: "boolean",
        category: "Global",
        default: true,
        description:
            "See https://twig.symfony.com/doc/2.x/coding_standards.html"
    },
    twigOutputEndblockName: {
        type: "boolean",
        category: "Global",
        default: false,
        description: "Output the Twig block name in the 'endblock' tag"
    }
};

const pluginExports = {
    languages,
    printers,
    parsers,
    options
};
const combinedExports = Object.assign(
    {},
    pluginExports,
    symbols,
    publicFunctions
);

// This exports defines the Prettier plugin
// See https://github.com/prettier/prettier/blob/master/docs/plugins.md
export default combinedExports;
