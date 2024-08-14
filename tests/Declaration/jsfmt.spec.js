import { run_spec } from "tests_config/run_spec";
import { describe, expect, it } from "vitest";

describe("Declaration", () => {
    it("should handle doctype declaration", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "doctype.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
});
