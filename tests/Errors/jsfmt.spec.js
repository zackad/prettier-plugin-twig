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
    describe("lexer", () => {
        it("should fail against non-breaking space token in expression", async () => {
            const promise = run_spec(import.meta.url, {
                source: "nonBreakingSpaceInExpression.twig"
            });
            await expect(promise).rejects.toThrow(
                "Unsupported token: Non-breaking space"
            );
        });
        it("should fail against unknown token in expression", async () => {
            const promise = run_spec(import.meta.url, {
                source: "unknownTokenInExpression.twig"
            });
            await expect(promise).rejects.toThrow("Unknown token ^");
        });
    });
});
