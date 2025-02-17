import { defineConfig, devices } from '@playwright/test';

require('dotenv').config();

export default defineConfig({
  testDir: './playwright',
  globalTimeout: process.env.CI ? 60 * 60 * 1000 : undefined,
  expect: {
    timeout: process.env.CI ? 30000 : 15000,
  },
  timeout: process.env.CI ? 90000 : 45000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  // TODO: We can handle only one worker because tests share the same database and many tests are resetting the database.
  workers: process.env.CI ? 1 : 1,
  reporter: process.env.CI ? [['blob'], ['line', { printSteps: true }]] : 'html',
  use: {
    baseURL: process.env.SITE_URL || 'http://localhost:8000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], launchOptions: { args: ['--auto-open-devtools-for-tabs'] } },
    },
  ],
});
