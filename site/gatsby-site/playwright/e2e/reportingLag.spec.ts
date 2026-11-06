import { test } from '../utils';
import { expect } from '@playwright/test';

test.describe('Reporting lag summary', () => {
  const url = '/summaries/reportingLag';

  test('renders the distribution, the scatter and the longest gaps', async ({ page }) => {
    await page.goto(url, { waitUntil: 'networkidle' });

    await expect(page.locator('h1')).toContainText('Reporting Lag');
    await expect(page.locator('[data-cy="lag-bucket"]')).toHaveCount(8);
    await expect(page.locator('[data-cy="lag-scatter"]')).toBeVisible();
    await expect(page.locator('[data-cy="lag-summary"]')).toContainText('incidents');
  });

  test('narrows the incidents by year and pins a point on click', async ({ page }) => {
    await page.goto(url, { waitUntil: 'networkidle' });

    const from = page.locator('[data-cy="from-year"]');

    // the static page is interactive before React hydrates: retry until the state follows
    await expect(async () => {
      await from.fill('1990');
      await expect(from).toHaveValue('1990', { timeout: 2000 });
    }).toPass();

    await expect(page.locator('[data-cy="lag-summary"]')).toContainText('incidents');

    const points = page.locator('[data-cy="lag-point"]');

    if ((await points.count()) > 0) {
      await expect(async () => {
        await points.first().click();
        await expect(page.locator('[data-cy="lag-pinned"]')).toBeVisible({ timeout: 2000 });
      }).toPass();

      // the pinned report stays, and stays clickable, after the pointer leaves the point
      // (Gatsby's Link adds a trailing slash before the hash)
      await page.mouse.move(0, 0);
      await expect(page.locator('[data-cy="lag-pinned-report"]')).toHaveAttribute(
        'href',
        /\/cite\/\d+\/?#r\d+/
      );

      await page.locator('[data-cy="lag-unpin"]').click();
      await expect(page.locator('[data-cy="lag-pinned"]')).toBeHidden();
    }
  });
});
