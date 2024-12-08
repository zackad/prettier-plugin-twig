import { readFileSync } from "fs";
import { resolve, extname, basename } from "path";
import { URL, fileURLToPath } from "url";
import { format, Options as PrettierOptions } from "prettier";
import plugin from "src/index";

/** @type {PrettierOptions} */
const defaultOptions = {
    parser: "twig",
    plugins: [plugin],
    tabWidth: 4
};

/**
 * @typedef TwigOptions
 * @property {string[]} [twigMultiTags] List of multi-line tags to treat as single-line. Default `[]`
 * @property {boolean} [twigSingleQuote] Use single quotes instead of double quotes. Default `true`
 * @property {boolean} [twigAlwaysBreakObjects] Should objects always break in Twig files? Default `true`
 * @property {int} [twigPrintWidth] Print width for Twig files. Default `80`
 * @property {boolean} [twigFollowOfficialCodingStandards] See https://twig.symfony.com/doc/3.x/coding_standards.html. Default `true`
 * @property {boolean} [twigOutputEndblockName] Output the Twig block name in the 'endblock' tag. Default `false`
 */

/**
 * @typedef {PrettierOptions & TwigOptions} FormattingOptions
 */

/**
 * Generate the snapshot file name from the source file name.
 *
 * @param {string} sourceFile The sourcefile
 * @param {string} prefix Add prefix to output filename
 * @param {string} suffix Add suffix to output filename
 * @returns {string} The snapshot file name
 */
function generateSnapshotFileName(sourceFile, prefix = "", suffix = "") {
    const ext = extname(sourceFile);
    let base = basename(sourceFile, ext);
    if (base === "unformatted") {
        base = "formatted";
    }
    return `${prefix}${base}${suffix}.snap${ext}`;
}

/**
 * @typedef RunSpecOptions
 * @property {string} [source] The source file. Default `"unformatted.twig"`.
 * @property {string} [prefix] Add prefix to output filename.
 * @property {string} [suffix] Add suffix to output filename.
 * @property {FormattingOptions} [formatOptions] Combined formatting options. Default `defaultOptions`.
 */

/**
 * @typedef RunSpecResult
 * @property {string} snapshotFile The snapshot file name.
 * @property {string} code The source code.
 * @property {string} actual The formatted code.
 */

/**
 * Compare two files with each other and returns the result to be passed in expect calls.
 *
 * @param {string} metaUrl Pass `import.meta.url`, so the function can resolve the files relatively.
 * @param {RunSpecOptions} [options] The source file and formatting options.
 * @returns {Promise<RunSpecResult>} The result to be passed in expect calls.
 */
export async function run_spec(metaUrl, options = {}) {
    const {
        prefix,
        suffix,
        source = "unformatted.twig",
        formatOptions = {}
    } = options;
    const dirname = fileURLToPath(new URL(".", metaUrl));

    const code = readFileSync(resolve(dirname, source), "utf8");
    const snapshotFile = resolve(
        dirname,
        "__snapshots__",
        generateSnapshotFileName(source, prefix, suffix)
    );
    const actual = await format(code, {
        parser: "twig",
        plugins: [plugin],
        tabWidth: 4,
        ...formatOptions
    });

    return { snapshotFile, code, actual };
}
