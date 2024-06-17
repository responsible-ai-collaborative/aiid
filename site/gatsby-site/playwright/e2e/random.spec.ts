import { test, expect } from '@playwright/test';

test.describe('Random', () => {
  const url = '/random';

  test('Should navigate to random page', async ({ page }) => {
    await page.goto(url);
    await page.waitForURL(new RegExp('/cite/\\d+/'));
  });
});
