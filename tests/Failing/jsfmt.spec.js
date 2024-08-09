import { run_spec } from "tests_config/run_spec";
import { describe, expect, it } from "vitest";

/** @type {import('tests_config/run_spec').PrettierOptions} */
const formatOptions = {
    twigPrintWidth: 120,
    twigAlwaysBreakObjects: true,
    twigFollowOfficialCodingStandards: false
};

describe("Failing", () => {
    it("should handle failing cases", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "failing.twig",
            formatOptions
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle controversial cases", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "controversial.twig",
            formatOptions
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
});
