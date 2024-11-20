import { run_spec } from "tests_config/run_spec";
import { describe, expect, it } from "vitest";

describe("Options", () => {
    it("should not always break objects", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "alwaysBreakObjects.twig",
            formatOptions: {
                twigAlwaysBreakObjects: false
            }
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should not output end block name", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "endblockName.twig",
            formatOptions: {
                twigOutputEndblockName: false
            }
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle a non-standard print-width", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "printWidth.twig",
            formatOptions: {
                printWidth: 120
            }
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
});
