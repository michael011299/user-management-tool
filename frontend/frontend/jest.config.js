module.exports = {
  preset: "react-scripts",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/index.tsx", "!src/**/*.test.{ts,tsx}", "!src/mocks/**"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transformIgnorePatterns: ["node_modules/(?!(axios|react-icons)/)"],
};
