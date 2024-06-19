import { expect } from '@playwright/test';
import { test } from '../utils';

test.describe('TSNE visualization page', () => {

  const url = '/summaries/spatial';

  test('Successfully loads', async ({ page }) => {
      await page.goto(url);
  });

  test('Should show an incident card on hover', async ({ page, skipOnEmptyEnvironment }) => {
      await page.goto(url);

      page.locator('[data-cy="tsne-visualization"] #spatial-incident-1').dispatchEvent('mouseover');

      await expect(
        page.locator(
          '[data-cy="tsne-visualization"] #spatial-incident-1 + [data-cy="incident-card"]'
        )
      ).toBeVisible();

  });

  // TODO: Fix this test
  test.skip('Should highlight source incident when one exists', async ({ page, skipOnEmptyEnvironment }) => {
      await page.goto(url + '?incident=1');

      page.locator('[data-cy="tsne-visualization"] #spatial-incident-1').dispatchEvent('mouseover');

      await expect(
        page.locator(
          '[data-cy="tsne-visualization"] [data-cy="tsne-plotpoint"].current'
        )
      ).toBeVisible();

  });

  test('Incident card should show title', async ({ page, skipOnEmptyEnvironment }) => {
      await page.goto(url);

      page.locator('[data-cy="tsne-visualization"] #spatial-incident-1').dispatchEvent('mouseover');

      await expect(
        page.locator(
          '[data-cy="tsne-visualization"] #spatial-incident-1 + [data-cy="incident-card"] [data-cy="title"]'
        )
      ).toBeVisible();
  });

  test('Should change the plotpoint color when the axis selection changes', async ({ page, skipOnEmptyEnvironment }) => {
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
