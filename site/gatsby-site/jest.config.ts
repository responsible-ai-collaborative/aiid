/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

require('dotenv').config();

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
};

export default config;
