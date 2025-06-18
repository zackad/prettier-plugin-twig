import { run_spec } from "tests_config/run_spec";
import { describe, expect, it } from "vitest";

describe("Expressions", () => {
    it("should handle array expressions", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "arrayExpression.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle arrow function expressions", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "arrowFunctions.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle binary expressions", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "binaryExpression.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle call expressions", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "callExpression.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle conditional expressions", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "conditionalExpression.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle filter expressions", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "filterExpression.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });

    it("should handle iterable operator", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "iterable_operator.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });

    it("should handle negative number without space", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "negative_number.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });

    it("should handle mapping expressions", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "mappingExpression.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle member expressions", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "memberExpression.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle object expressions", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "objectExpression.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle operators", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "operators.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });

    it("should handle spread operators", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "spread_operator.twig",
            formatOptions: {
                twigAlwaysBreakObjects: false
            }
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });

    it("should handle string concatenation", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "stringConcat.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle string literals", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "stringLiteral.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle unary not", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "unaryNot.twig"
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
    it("should handle custom test expressions", async () => {
        const { actual, snapshotFile } = await run_spec(import.meta.url, {
            source: "custom_test_expression.twig",
            formatOptions: {
                twigTestExpressions: ["snake_case_test", "camelCaseTest"]
            }
        });
        await expect(actual).toMatchFileSnapshot(snapshotFile);
    });
});
