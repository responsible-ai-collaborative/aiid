/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

// Must be an `import`, not `require`: Jest 30 loads this config with Node's
// native TypeScript support, which treats the file as ESM because of the
// `export default` below.
import 'dotenv/config';

const config: Config = {
  preset: "ts-jest",
  clearMocks: true,
  collectCoverage: true,
  testTimeout: 10000,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  globalSetup: "./globalSetup.ts",
  globalTeardown: "./globalTeardown.ts",
  verbose: true,
  setupFiles: ["dotenv/config"],
  testMatch: [
    "**/server/tests/**/*.spec.ts",
  ],
  // TODO: create a database mock per worker
  maxWorkers: 1,
};

export default config;
