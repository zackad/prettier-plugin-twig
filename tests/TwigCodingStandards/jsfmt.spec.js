import { run_spec } from "tests_config/run_spec";
import { describe, expect, it } from "vitest";

/** @type {import('tests_config/run_spec').PrettierOptions} */
const formatOptions = {
    twigAlwaysBreakObjects: false
};

describe("Twig coding standards", () => {
    it("should follow twig coding standards", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "twigCodingStandards.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
});
