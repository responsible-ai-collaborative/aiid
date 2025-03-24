import { test, query } from '../utils';
import { format, fromUnixTime } from 'date-fns';
import supportedLanguages from '../../src/components/i18n/languages.json';
import { expect } from '@playwright/test';
import config from '../config';
import gql from 'graphql-tag';
import { init } from '../memory-mongo';

test.describe('Report History', () => {
  const url = '/cite/history?report_number=1';
  const urlNoHistory = '/cite/history?report_number=2';

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test('Should display the Report Version History table data', async ({ page }) => {

    await init();

    const { data: { history_reports } } = await query({
      query: gql`
        {
          history_reports(sort: {date_modified: DESC}) {
            title
            report_number
            date_modified
            modifiedBy
          }
        }
      `
    });

    await page.goto(url);

    await expect(page.getByText('Version History')).toBeVisible();

    const rows = await page.locator('[data-cy="history-row"]').count();

    expect(rows).toBe(history_reports.length);

    for (let index = 0; index < history_reports.length; index++) {
      const history = history_reports[index];
      const date = format(new Date(history.date_modified), 'yyyy-MM-dd hh:mm a');

      await expect(page.locator('[data-cy="history-row"]').nth(index)).toContainText(date);

      await expect(page.locator('[data-cy="history-row"]').nth(index)).toContainText(
        `Modified by: ${history.modifiedBy === '6737a6e881955aa4905ccb04' ? 'Test User' : 'John Doe'}`
      );
    }

    await expect(page.locator('[data-cy="history-row"]').last()).toContainText('Initial version');
  });

  test('Should not display the Report Version History table data if no data is present', async ({ page }) => {
    await page.goto(urlNoHistory);

    await expect(page.getByText('Version History')).not.toBeVisible();
    await expect(page.locator('[data-cy="history-table"]')).not.toBeVisible();
    await expect(page.getByText('There are no version history records for this Report')).toBeVisible({ timeout: 30000 });
  });

  test('Should go back to the Incident Report', async ({ page }) => {
    await page.goto(url);
    await expect(page.getByText('Back to Report 1')).toBeVisible();
    await page.getByText('Back to Report 1').click();
    await page.waitForURL('/cite/1/#r1');
  });

  test('Should go back to the Issue Report', async ({ page }) => {
    await page.goto('/cite/history?report_number=5&incident_id=null');
    await page.getByText('Back to Report 5').click();
    await page.waitForURL('/reports/5/');
  });

  test('Should refresh Report history if the user go back on the browser', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto('/cite/1/');

    await expect(async () => {
      await page.getByText('Read More').first().click();
      await expect(page.locator('[data-cy="report-history-button"]')).toBeVisible({ timeout: 1000 });
    }).toPass();

    await page.locator('[data-cy="report-history-button"]').click();

    await expect(page).toHaveURL('/cite/history/?report_number=1&incident_id=1');

    await page.goBack();

    await expect(page).toHaveURL('/cite/1/');
  });

  test('Should not be able to restore a version if the user does not have the right permissions', async ({ page }) => {
    await page.goto(url);
    await expect(page.getByText('Restore Version')).not.toBeVisible();
  });

  test('Should restore a Report previous version', async ({ page, login }) => {

    await init();

    const { data: { history_reports } } = await query({
      query: gql`
        {
          history_reports(sort: {date_modified: DESC}) {
            title
            text
            report_number
            date_modified
            modifiedBy
          }
        }
      `
    });

    const [userId] = await login({ customData: { roles: ['admin'] } });

    await page.goto(url);

    for (let index = 0; index < history_reports.length; index++) {
      if (index === 0) {
        await expect(page.locator('[data-cy="history-row"]').nth(index).locator('[data-cy="restore-button"]')).not.toBeVisible();
      } else {
        await expect(page.locator('[data-cy="history-row"]').nth(index).locator('[data-cy="restore-button"]')).toBeVisible();
      }
    }

    page.once('dialog', async dialog => {
      await dialog.accept();
    });

    await page.locator('[data-cy="history-row"] [data-cy="restore-button"]').last().click();
    await expect(page.getByTestId("restoring-message")).toBeVisible();


    await expect(page.locator('[data-cy="toast"]')).toHaveText('Report version restored successfully.');

    await expect(page.locator('[data-cy="restoring-message"]')).not.toBeVisible();


    const { data: { report, history_report } } = await query({
      query: gql`
        {
          report(filter: {report_number: { EQ:  1 }}) {
            title
            text
            report_number
            date_modified
          }
          history_report(sort: {date_modified: DESC}) {
            title
            text
            report_number
            date_modified
            modifiedBy
          }
        }
      `
    });

    // TODO: be more specific about the report that was restored
    await expect(report.title).toBe(history_reports[history_reports.length - 1].title);
    await expect(report.text).toBe(history_reports[history_reports.length - 1].text);
    await expect(history_report.modifiedBy).toBe(userId);
  });

  test('Should display the Report Version History details modal', async ({ page }) => {

    await init();

    const { data: { history_reports } } = await query({
      query: gql`
        {
          history_reports(sort: {date_modified: DESC}) {
            title
            report_number
            epoch_date_modified
            modifiedBy
            authors
            submitters
            date_published
            date_downloaded
            image_url
            language
            tags
            editor_notes
            text
            cloudinary_id
          }
        }
      `
    });

    await page.goto(url);

    await page.locator('[data-cy="history-row"]').nth(1).locator('[data-cy="view-full-version-button"]').click();

    await expect(page.locator('[data-cy="version-view-modal"]')).toBeVisible();

    const version = history_reports[1];

    await expect(page.getByText('Version details')).toBeVisible();
    await expect(page.getByText(`Modified on: ${format(fromUnixTime(version.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}`)).toBeVisible();
    await expect(page.locator('[data-cy="version-view-modal"] div').filter({ hasText: 'Modified by: John Doe' }).first()).toBeVisible();


    const fields = [
      { label: 'Report Address:', value: version.url },
      { label: 'Title:', value: version.title },
      { label: 'Author CSV:', value: version.authors.join(', ') },
      { label: 'Submitter CSV:', value: version.submitters.join(', ') },
      { label: 'Date Published:', value: version.date_published },
      { label: 'Date Downloaded:', value: version.date_downloaded },
      { label: 'Image Address:', value: version.image_url },
      { label: 'Text:', value: version.text },
      { label: 'Language:', value: supportedLanguages.find((l) => l.code == version.language)?.name },
      { label: 'Tags:', value: version.tags.join(', ') },
      { label: 'Editor Notes:', value: version.editor_notes }
    ];

    for (const field of fields) {
      await expect(page.getByText(field.label)).toBeVisible();
      await expect(page.locator('[data-cy="version-view-modal"] div').filter({ hasText: field.value }).first()).toBeVisible();

    }

    await expect(page.locator('[data-cy="version-view-modal"] [data-cy="cloudinary-image"]').first()).toHaveAttribute('src', expect.stringContaining(version.cloudinary_id));

    await page.locator('[data-cy="version-view-modal"] button').filter({ hasText: 'Close' }).click();
    await expect(page.locator('[data-cy="version-view-modal"]')).not.toBeVisible();
  });
});