import { run_spec } from "tests_config/run_spec";
import { describe, expect, it } from "vitest";

describe("Elements", () => {
    it("should support any valid html attributes so that things like AlpineJS work #37", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "alpinejs.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle attributes", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "attributes.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle breaking siblings", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "breakingSiblings.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle child elements", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "children.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should remove multiple empty lines", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "emptyLines.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should remove extra spaces within element brackets", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "extraSpaces.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle many attributes", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "manyAttributes.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("convert inline elements to one line where possible", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "oneLine.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle self closing elements", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "selfClosing.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle siblings", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "siblings.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle whitespace", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "whitespace.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });

    it("should handle ownline html element", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "ownline_html_element.twig"
        });
        expect(actual).toMatchFileSnapshot(snapshotFile);
    });
});
