import { run_spec } from "tests_config/run_spec";
import { describe, expect, it } from "vitest";

/** @type {import('tests_config/run_spec').PrettierOptions} */
const formatOptions = {};

describe("Whitespace", () => {
    it("should handle whitespace", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "element.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
});
