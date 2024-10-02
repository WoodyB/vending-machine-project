module.exports = {
    setupFilesAfterEnv: ["./config.js"],
    reporters: [
      "default",
      ["./node_modules/jest-html-reporter", {
        "pageTitle": "Test Report"
      }]
    ],
    roots: [
      "<rootDir>/"
    ],
    testMatch: [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    transform: {
      "^.+\\.(ts|tsx)$": ["ts-jest", {tsconfig: "tsconfig.json"}]
    },
    collectCoverageFrom: [
      "**/*.{jsx,ts,tsx}",
      "!**/*.d.ts",
      "!**/node_modules/**",
      "!**/test/**"
    ],
  }