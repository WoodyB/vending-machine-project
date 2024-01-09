module.exports = {
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
      "**/*.{js,jsx,ts,tsx}",
      "!**/*.d.ts",
      "!**/node_modules/**",
    ],
  }