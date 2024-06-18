import { test, expect } from '@playwright/test';
import { conditionalIt } from '../utils';

test.describe('TSNE visualization page', () => {

  const url = '/summaries/spatial';

  test('Successfully loads', async ({ page }) => {
      await page.goto(url);
  });

  conditionalIt(
    process.env.isEmptyEnvironment !== 'true',
    'Should show an incident card on hover', 
    async ({ page }) => {
      await page.goto(url);

      page.locator('[data-cy="tsne-visualization"] #spatial-incident-1').dispatchEvent('mouseover');

      await expect(
        page.locator(
          '[data-cy="tsne-visualization"] #spatial-incident-1 + [data-cy="incident-card"]'
        )
      ).toBeVisible();

  });

  conditionalIt(
    process.env.isEmptyEnvironment !== 'true',
    'Should highlight source incident when one exists', 
    async ({ page }) => {
      await page.goto(url + '?incident=1');

      page.locator('[data-cy="tsne-visualization"] #spatial-incident-1').dispatchEvent('mouseover');

      await expect(
        page.locator(
          '[data-cy="tsne-visualization"] [data-cy="tsne-plotpoint"].current'
        )
      ).toBeVisible();

  });

  conditionalIt(
    process.env.isEmptyEnvironment !== 'true',
    'Incident card should show title', 
    async ({ page }) => {
      await page.goto(url);

      page.locator('[data-cy="tsne-visualization"] #spatial-incident-1').dispatchEvent('mouseover');

      await expect(
        page.locator(
          '[data-cy="tsne-visualization"] #spatial-incident-1 + [data-cy="incident-card"] [data-cy="title"]'
        )
      ).toBeVisible();
  });

  conditionalIt(
    process.env.isEmptyEnvironment !== 'true',
    'Should change the plotpoint color when the axis selection changes', 
    async ({ page }) => {
      await page.goto(url);

      const initialBackground = await page.$eval('[data-cy="tsne-visualization"] #spatial-incident-1', el => getComputedStyle(el).backgroundColor);

      await page.locator('#color-axis-select').selectOption('CSETv0::Harm Distribution Basis');

      await expect(
        JSON.stringify(
          await page.$eval('[data-cy="tsne-visualization"] #spatial-incident-1', el => getComputedStyle(el).backgroundColor)
        ) == JSON.stringify(initialBackground)
      ).toBeFalsy();
  });
});
