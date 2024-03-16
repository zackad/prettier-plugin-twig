"use strict";

export default {
    runner: "jest-runner-eslint",
    displayName: "lint",
    testMatch: ["<rootDir>/**/*.js"],
    testPathIgnorePatterns: ["node_modules/"]
};
