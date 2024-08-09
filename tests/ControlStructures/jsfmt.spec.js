import { run_spec } from "tests_config/run_spec";
import { describe, expect, it } from "vitest";

describe("Control structures", () => {
    it("should handle for loops", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "for.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle for loops with conditions", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "forIfElse.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle for loops with includes", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "forInclude.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle for loops with blocks", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "forWithBlock.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle if statements", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "if.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
});
