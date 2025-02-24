import { expect } from "@playwright/test";
import { test } from "../../utils";
import { init } from "../../memory-mongo";


test.describe('Reports App', () => {
  const url = '/apps/incidents';

  test('Successfully loads reports', async ({ page }) => {
    await page.goto(url + '?view=reports');
  });

  test('Successfully loads issue reports', async ({ page }) => {
    await page.goto(url + '?view=issueReports');
  });

  test('Filters a report by title', async ({ page }) => {
    await init();
    await page.goto(url + '?view=reports');
    await page.locator('[data-cy="filter"]').nth(1).locator('input').fill('Report 2');
    await expect(page.locator('[data-cy="row"]')).toHaveCount(1);
  });
});
