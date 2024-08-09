import { resolve } from "path";
import { URL, fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            src: resolve(__dirname, "src"),
            tests: resolve(__dirname, "tests")
        }
    },
    test: {
        dir: "tests",
        setupFiles: ["./tests_config/run_spec.js"],
        testRegex: "jsfmt\\.spec\\.js$|__tests__/.*\\.js$"
    }
});
