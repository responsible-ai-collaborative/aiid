import { test } from '@playwright/test';

test.describe('Incidents Summary', () => {
  const url = '/summaries/flagged';

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });
});
