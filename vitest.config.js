import { resolve } from "path";
import { defineConfig } from "vitest/config";

const ENABLE_COVERAGE = false; // !!process.env.CI;

export default defineConfig({
    resolve: {
        alias: {
            src: resolve(__dirname, "./src"),
            tests: resolve(__dirname, "./tests")
        }
    },
    test: {
        setupFiles: ["./tests_config/run_spec.js"],
        snapshotSerializers: ["./tests_config/raw-serializer.js"],
        testRegex: "jsfmt\\.spec\\.js$|__tests__/.*\\.js$"
    }
});
