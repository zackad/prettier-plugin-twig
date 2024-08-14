import { run_spec } from "tests_config/run_spec";
import { describe, expect, it } from "vitest";

describe("Comments", () => {
    it("should handle html comments", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "htmlComments.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });

    it("should handle twig comments", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "twigComments.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
});
