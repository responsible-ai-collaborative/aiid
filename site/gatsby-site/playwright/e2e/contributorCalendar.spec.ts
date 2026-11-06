import { test } from '../utils';
import { expect } from '@playwright/test';

test.describe('Contributor calendar summary', () => {
  const url = '/summaries/contributorCalendar';

  test('renders one row per year and lists the reports of a day', async ({ page }) => {
    await page.goto(url, { waitUntil: 'networkidle' });

    await expect(page.locator('h1')).toContainText('Contributor Calendar');

    const rows = await page.locator('[data-cy="calendar-year-row"]').count();

    expect(rows).toBeGreaterThanOrEqual(1);

    expect(await page.locator('[data-cy="calendar-day"]').count()).toBeGreaterThanOrEqual(
      365 * rows
    );

    const busy = page.locator('[data-cy="calendar-day"]:not([data-count="0"])');

    if ((await busy.count()) > 0) {
      // the static page is clickable before React hydrates: retry until the click takes
      await expect(async () => {
        await busy.first().click();
        await expect(
          page.locator('[data-cy="calendar-panel"] a[href*="/cite/"]').first()
        ).toBeVisible({ timeout: 2000 });
      }).toPass();

      // each submitter named next to a report links to their reports in Discover
      const submitterLink = page.locator('[data-cy="calendar-submitter-link"]').first();

      if ((await submitterLink.count()) > 0) {
        // Gatsby's Link adds a trailing slash before the query string
        await expect(submitterLink).toHaveAttribute('href', /\/apps\/discover\/?\?submitters=/);
      }
    }
  });

  test('narrows every year to one submitter', async ({ page }) => {
    await page.goto(url, { waitUntil: 'networkidle' });

    const submitter = page.locator('[data-cy="calendar-submitter"]');

    const options = await submitter.locator('option').allTextContents();

    if (options.length > 1) {
      await expect(async () => {
        await submitter.selectOption({ index: 1 });
        await expect(submitter).not.toHaveValue('all', { timeout: 2000 });
      }).toPass();
    }

    await expect(page.locator('[data-cy="calendar-summary"]')).toContainText('reports submitted');
  });
});
