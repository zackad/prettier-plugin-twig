import { readFileSync } from "fs";
import { resolve, extname, basename } from "path";
import { URL, fileURLToPath } from "url";
import { format } from "prettier";
import plugin from "src/index";

/**
 * Generate the snapshot file name from the source file name.
 *
 * @param {string} sourceFile The sourcefile
 * @returns {string} The snapshot file name
 */
function generateSnapshotFileName(sourceFile) {
    const ext = extname(sourceFile);
    let base = basename(sourceFile, ext);
    if (base === "unformatted") {
        base = "formatted";
    }
    return `${base}.snap${ext}`;
}

/**
 * @typedef {import("prettier").Options} PrettierOptions
 */

/**
 * Compare two files with each other and returns the result to be passed in expect calls.
 *
 * @param {string} metaUrl - Pass `import.meta.url`, so the function can resolve the files relatively.
 * @param {Object} [compareOptions] - Compare options.
 * @param {string} [compareOptions.source='unformatted.twig'] - The source file.
 * @param {PrettierOptions} [compareOptions.formatOptions] - Further format options.
 * @returns {Promise<{snapshotFile: string, code: string, actual: string}>} - The result to be passed in expect calls.
 */
export async function run_spec(metaUrl, compareOptions = {}) {
    const { source = "unformatted.twig", formatOptions = {} } = compareOptions;
    const dirname = fileURLToPath(new URL(".", metaUrl));

    const code = readFileSync(resolve(dirname, source), "utf8");
    const snapshotFile = resolve(
        dirname,
        "__snapshots__",
        generateSnapshotFileName(source)
    );
    const actual = await format(code, {
        parser: "twig",
        plugins: [plugin],
        tabWidth: 4,
        ...formatOptions
    });

    return { snapshotFile, code, actual };
}
