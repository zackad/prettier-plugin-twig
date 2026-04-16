import { doc } from "prettier";
import { PRETTIER_IGNORED_CODE } from "../util/publicSymbols.js";

/**
 * @typedef {import('../../melody-types/index.js').PrintErroredStatement} node
 */
const printErroredStatement = (node, path, print) => {
    if (node[PRETTIER_IGNORED_CODE]) {
        return path.call(print, "value");
    }

    throw node.cause;
};

export { printErroredStatement };
