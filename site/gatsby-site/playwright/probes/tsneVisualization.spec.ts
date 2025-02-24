import { expect } from '@playwright/test';
import { test } from '../utils';

test.describe('TSNE visualization page', () => {

  const url = '/summaries/spatial';

  test('Successfully loads', async ({ page }) => {
      await page.goto(url);
  });

  test.skip('Should show an incident card on hover', async ({ page, skipOnEmptyEnvironment }) => {
      await page.goto(url);
    await page.waitForSelector('[data-cy="tsne-visualization"] #spatial-incident-1');

    const incident = page.locator('[data-cy="tsne-visualization"] #spatial-incident-1');
    await incident.hover();
    await page.waitForTimeout(200);

      await expect(
        page.locator(
          '[data-cy="tsne-visualization"] #spatial-incident-1 + [data-cy="incident-card"]'
        )
      ).toBeVisible();

  });

  test.skip('Should highlight source incident when one exists', async ({ page, skipOnEmptyEnvironment }) => {
    
      await page.goto('/cite/1/');

      await page.locator('#similar-incidents:above(a)').last().click();

    await page.waitForSelector('[data-cy="tsne-visualization"] [data-cy="tsne-plotpoint"].current');

      page.locator('[data-cy="tsne-visualization"] #spatial-incident-1').dispatchEvent('mouseover');

      await expect(
        page.locator(
          '[data-cy="tsne-visualization"] [data-cy="tsne-plotpoint"].current'
        )
      ).toBeVisible();
  });

  test.skip('Incident card should show title', async ({ page, skipOnEmptyEnvironment }) => {
      await page.goto(url);

      page.locator('[data-cy="tsne-visualization"] #spatial-incident-1').dispatchEvent('mouseover');

      await expect(
        page.locator(
          '[data-cy="tsne-visualization"] #spatial-incident-1 + [data-cy="incident-card"] [data-cy="title"]'
        )
      ).toBeVisible();
  });

  test.skip('Should change the plotpoint color when the axis selection changes', async ({ page, skipOnEmptyEnvironment }) => {
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
