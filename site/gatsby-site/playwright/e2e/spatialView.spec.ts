import { test } from '../utils';
import { expect } from '@playwright/test';

test.describe('Spatial view', () => {
  const url = '/summaries/spatial';

  test('finds an incident and marks it on the map', async ({ page }) => {
    await page.goto(url, { waitUntil: 'networkidle' });

    const points = page.locator('[data-cy="tsne-plotpoint"]');

    await expect(points.first()).toBeAttached();

    const id = await points.first().getAttribute('data-incident-id');

    const search = page.locator('[data-cy="tsne-search"]');

    const results = page.locator('[data-cy="tsne-search-results"] button');

    // the static page accepts typing before React hydrates: retry until the results follow
    await expect(async () => {
      await search.fill('');
      await search.fill(`#${id}`);
      await expect(results.first()).toBeVisible({ timeout: 2000 });
    }).toPass();

    await results.first().click();

    await expect(page).toHaveURL(new RegExp(`incident=${id}`));
    await expect(page.locator(`#spatial-incident-${id}`)).toHaveClass(/current/);
    await expect(page.locator('[data-cy="tsne-current-ring"]')).toBeAttached();
  });

  test('marks the incident given in the address', async ({ page }) => {
    await page.goto(url, { waitUntil: 'networkidle' });

    const id = await page
      .locator('[data-cy="tsne-plotpoint"]')
      .first()
      .getAttribute('data-incident-id');

    await page.goto(`${url}?incident=${id}`, { waitUntil: 'networkidle' });

    await expect(page.locator(`#spatial-incident-${id}`)).toHaveClass(/current/);
  });

  test('hides and shows categories from the legend', async ({ page }) => {
    await page.goto(url, { waitUntil: 'networkidle' });

    const points = page.locator('[data-cy="tsne-plotpoint"]');

    await expect(points.first()).toBeAttached();

    const total = await points.count();

    await expect(async () => {
      await page.locator('[data-cy="tsne-hide-all"]').click();
      await expect(points).toHaveCount(0, { timeout: 2000 });
    }).toPass();

    await expect(page.locator('[data-cy="tsne-summary"]')).toContainText(`0 of ${total}`);

    await page.locator('[data-cy="tsne-show-all"]').click();
    await expect(points).toHaveCount(total);

    await page.locator('[data-cy="tsne-legend-toggle"]').first().uncheck();
    expect(await points.count()).toBeLessThan(total);
  });

  test('shows an incident card on hover', async ({ page }) => {
    await page.goto(url, { waitUntil: 'networkidle' });

    // unclassified points are drawn first, under the others: hover the topmost one
    const point = page.locator('[data-cy="tsne-plotpoint"]').last();

    await expect(async () => {
      await page.mouse.move(0, 0);
      await point.hover({ timeout: 2000 });
      await expect(page.locator('[data-cy="incident-card"] [data-cy="title"]')).toBeVisible({
        timeout: 2000,
      });
    }).toPass();
  });
});
