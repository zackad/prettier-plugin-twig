import { run_spec } from "tests_config/run_spec";
import { describe, expect, it } from "vitest";

describe("Twig coding standards", () => {
    it("disable follow twig coding standards", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "disable_twig_coding_standards.twig",
            formatOptions: {
                twigFollowOfficialCodingStandards: false
            }
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });

    it("enable follow twig coding standards", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "enable_twig_coding_standards.twig",
            formatOptions: {
                twigFollowOfficialCodingStandards: true
            }
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
});
