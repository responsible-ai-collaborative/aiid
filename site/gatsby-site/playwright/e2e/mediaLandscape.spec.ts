import { test } from '../utils';
import { expect } from '@playwright/test';

test.describe('Media landscape summary', () => {
  const url = '/summaries/mediaLandscape';

  test('renders the treemap and zooms into a publication to show its authors', async ({ page }) => {
    await page.goto(url, { waitUntil: 'networkidle' });

    await expect(page.locator('h1')).toContainText('Media Landscape');
    await expect(page.locator('[data-cy="media-treemap-svg"]')).toBeVisible();

    const tiles = page.locator('[data-cy="treemap-tile"]');

    await expect(tiles.first()).toBeVisible();

    const domain = await tiles.first().getAttribute('data-domain');

    // the static page is clickable before React hydrates: retry until the zoom takes
    await expect(async () => {
      await tiles.first().click();
      await expect(page.locator('[data-cy="treemap-back"]')).toBeVisible({ timeout: 2000 });
    }).toPass();

    await expect(page.locator('[data-cy="treemap-focus"]')).toContainText(domain);
    await expect(page.locator('[data-cy="treemap-author"]').first()).toBeVisible();

    // an author tile opens that author's reports from the publication in Discover
    await expect(
      page.locator(`a[href*="source_domain=${encodeURIComponent(domain)}"]`).first()
    ).toBeAttached();

    await page.locator('[data-cy="treemap-back"]').click();

    await expect(page.locator('[data-cy="treemap-back"]')).toBeHidden();
    await expect(tiles.first()).toBeVisible();
  });

  test('groups tiles by top-level domain and filters by year', async ({ page }) => {
    await page.goto(url, { waitUntil: 'networkidle' });

    // the static page is interactive before React hydrates: retry until the state follows
    await expect(async () => {
      await page.locator('[data-cy="treemap-group"]').check();
      await expect(page.locator('[data-cy="treemap-group"]')).toBeChecked({ timeout: 2000 });
      await expect(page.locator('[data-cy="media-treemap-svg"] text').first()).toContainText('.', {
        timeout: 2000,
      });
    }).toPass();

    const year = page.locator('[data-cy="treemap-year"]');

    const options = await year.locator('option').allTextContents();

    if (options.length > 1) {
      await expect(async () => {
        await year.selectOption({ index: 1 });
        await expect(year).not.toHaveValue('all', { timeout: 2000 });
      }).toPass();

      await expect(page.locator('[data-cy="treemap-summary"]')).toContainText('reports from');
    }
  });
});
