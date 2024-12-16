import { expect, Page, Download } from '@playwright/test';
import { conditionalIntercept, mockDate, waitForRequest, test, mockAlgolia, query } from '../../utils';
import { getUnixTime } from 'date-fns';
import { deleteReportTypenames, transformReportData } from '../../../src/utils/reports';
import gql from 'graphql-tag';
import { init } from '../../memory-mongo';

test.describe('The Discover app', () => {
  const url = '/apps/discover';

  test('Should flag an incident', async ({ page, skipOnEmptyEnvironment }) => {

    await init({
      aiidprod: {
        incidents: [
          {
            incident_id: 2,
            title: "BlenderBot 3 Cited Dutch Politician",
            description: "BlenderBot 3 Cited Dutch Politician as"
          }],
        reports: [
          {
            report_number: 1967,
            incident_id: 2,
            title: "BlenderBot 3 Cited Dutch Politician",
            description: "BlenderBot 3 Cited Dutch Polit",
            flag: false,
          }]
      }
    });

    await mockAlgolia(page);

    const now = new Date('June 21 2026 13:00:00');

    await mockDate(page, now);

    await page.goto(
      url +
      '?display=details&incident_id=2&s=Test%20Incident%201'
    );

    await page.click(`[data-cy-report-number="1"] [data-cy="flag-button"]`);

    const modal = page.locator('[data-cy="flag-report-1"]');
    await expect(modal).toBeVisible();

    await modal.locator('[data-cy="flag-toggle"]').click();
    await expect(modal.locator('[data-cy="flag-toggle"]')).toBeDisabled();

    const result = await query({
      query: gql`{
              report(filter: { report_number: { EQ: 1 } }) {
                report_number
                flag
                date_modified
                epoch_date_modified
            }
          }`
    });

    const input = result.data.report;

    await expect(input?.flag).toBe(true);

    await expect(modal.locator('[data-cy="flag-toggle"]')).toBeDisabled();
    await modal.locator('[aria-label="Close"]').click();
    await expect(modal).not.toBeVisible();
  });

});