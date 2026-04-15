import { run_spec } from "tests_config/run_spec";
import { describe, expect, it } from "vitest";

describe("Errors", () => {
    describe("parsers", () => {
        it("should fail against unexpected token in expression", async () => {
            const promise = run_spec(import.meta.url, {
                source: "unexpectedTokenInExpression.twig"
            });
            await expect(promise).rejects.toThrow("Invalid Token");
        });
        it("should fail against unexpected token in tag", async () => {
            const promise = run_spec(import.meta.url, {
                source: "unexpectedTokenInTag.twig"
            });
            await expect(promise).rejects.toThrow("Invalid Token");
        });
    });
});
