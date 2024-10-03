module.exports = {
    setupFilesAfterEnv: [
        "./config.console.js",
        // NOTE: Here we would substitute a console that logs to a file(s).
        // For now we are just creating a file using a linus > in the package.json
        // script to create manual-test-cases.txt
    ],
    reporters: [],
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