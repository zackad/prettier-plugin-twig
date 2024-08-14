import { run_spec } from "tests_config/run_spec";
import { describe, expect, it } from "vitest";

describe("Statements", () => {
    it("should handle autoescape statements", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "autoescape.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle do statements", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "do.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle filter statements", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "filter.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle flush statements", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "flush.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle macro statements", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "macro.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle set statements", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "set.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle spaceless statements", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "spaceless.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
});
