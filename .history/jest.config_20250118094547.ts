const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/pages/(.*)$": "<rootDir>/pages/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{jsx,tsx}",
    "!<rootDir>/src/pages/api/*.{js,jsx,ts,tsx}",
    "!<rootDir>/src/pages/fonts/*.{js,jsx,ts,tsx}",
    "!<rootDir>/src/pages/_app.tsx",
    "!<rootDir>/src/pages/_document.tsx",
    "!<rootDir>/src/pages/index.tsx",
  ],
};

module.exports = createJestConfig(config);
