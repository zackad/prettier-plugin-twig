import { run_spec } from "tests_config/run_spec";
import { describe, expect, it } from "vitest";

describe("Experimental", () => {
    it("Properly indent chain method", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "chain_indentation.twig",
            formatOptions: {
                experimentalMethodChainIndentation: true
            }
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
});
