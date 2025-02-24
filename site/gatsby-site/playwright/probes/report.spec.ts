import { expect } from '@playwright/test';
import config from '../config';
import { test } from '../utils';

test.describe('Report pages', () => {
  test.beforeAll(async () => {
    if (config.IS_EMPTY_ENVIRONMENT == 'true') {
      test.skip();
    }
  });

  const reportNumber = 2302;
  const url = `/reports/${reportNumber}`;

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test('Should always be expanded', async ({ page }) => {
    await page.goto(url);
    await expect(page.getByTestId("incident-report-card")).toHaveClass(/expanded/);
  });
});
