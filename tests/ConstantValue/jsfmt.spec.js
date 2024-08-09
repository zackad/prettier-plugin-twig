import { run_spec } from "tests_config/run_spec";
import { describe, expect, it } from "vitest";

describe("Constant values", () => {
    it("should handle constant value int", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "int.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle constant value string", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "string.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle constant value special cases", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "special.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
});
