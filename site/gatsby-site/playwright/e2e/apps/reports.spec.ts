import { expect } from "@playwright/test";
import { test } from "../../utils";
import { init } from "../../memory-mongo";
import reports from "../../seeds/aiidprod/reports";
import { DBReport } from "../../../server/interfaces";
import { isCompleteReport } from "../../../src/utils/variants";

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

  test('All report pages are accessible and properly rendered', async ({ page }) => {
    await init();

    for (const report of reports.filter(r => isCompleteReport(r))) {
      // Navigate to report page
      await page.goto(`/reports/${report.report_number}`);
      await expect(page).toHaveURL(`/reports/${report.report_number}/`);

      // Check that the page loads successfully
      await expect(page.locator('body')).not.toHaveText('404');
      await expect(page.locator('body')).not.toHaveText('Error');

      // Verify report card elements
      const reportCard = page.locator('[data-testid="incident-report-card"]');
      await expect(reportCard).toBeVisible();

      // Check title
      await expect(reportCard.locator('h5')).toContainText(report.title);

      // Check source and date
      await expect(reportCard.locator('a').first()).toContainText(report.source_domain);

      // Check image
      if (report.cloudinary_id) {
        //Wait for data-testid="cloudinary-image-skeleton" to be not visible (It means the image has loaded successfully or fallback is displayed)
        await expect(reportCard.getByTestId('cloudinary-image-skeleton')).not.toBeVisible();
        // Checks if placeholder exists, to know if the image has loaded successfully
        const placeHolderExists = await reportCard.locator('[data-cy="cloudinary-image-placeholder"]').isVisible();
        if (!placeHolderExists) {
          const image = reportCard.locator('[data-cy="cloudinary-image"]').first();
          const src = await image.getAttribute('src');
          expect(src).toMatch(new RegExp(`https://res.cloudinary.com/pai/image/upload/f_auto/q_auto/c_fill,h_480/(v1/)?${report.cloudinary_id}`));
        }
      }

      // Check text content
      await expect(reportCard).toContainText(report.text);

      // If report has variants, check inputs/outputs
      if (report.inputs_outputs?.length > 0) {
        await expect(reportCard.locator('[data-cy="variant-inputs-outputs"]')).toBeVisible();
      }

      // Check associated incidents if any
      if (report.is_incident_report) {
        const incidentsCard = page.locator('[data-cy="classifications-editor"]');
        await expect(incidentsCard).toBeVisible();
      }
    }
  });
});

