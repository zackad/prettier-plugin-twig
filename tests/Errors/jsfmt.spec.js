import { run_spec } from "tests_config/run_spec";
import { describe, expect, it } from "vitest";

describe("Errors", () => {
    describe("parsers", () => {
        it("should reject mismatched variable tag names", async () => {
            const promise = run_spec(import.meta.url, {
                source: "mismatched_dynamic_tags.twig"
            });
            await expect(promise).rejects.toThrow(
                "Expected </{{ inner }}>, found </{{ outer }}>"
            );
        });
        it("should fail against unexpected token in expression", async () => {
            const promise = run_spec(import.meta.url, {
                source: "unexpectedTokenInExpression.twig"
            });
            await expect(promise).rejects.toThrow("Invalid Token");
        });
        it("should fail against inline comment in unsupported position", async () => {
            const promise = run_spec(import.meta.url, {
                source: "unsupported_inline_comment_position.twig"
            });
            await expect(promise).rejects.toThrow(
                "Unsupported inline comment position"
            );
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
