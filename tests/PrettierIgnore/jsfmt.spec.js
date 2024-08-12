import { run_spec } from "tests_config/run_spec";
import { describe, expect, it } from "vitest";

describe("Prettier ignore", () => {
    it("should handle single line ignore", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "prettierIgnore.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle ignore blocks", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "prettierIgnoreStartEnd.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
});
