import { test, conditionalIntercept, waitForRequest, query } from '../utils';
import { format, fromUnixTime, getUnixTime } from 'date-fns';
import reportHistory from '../fixtures/history/reportHistory.json';
import updateOneReport from '../fixtures/reports/updateOneReport.json';
import supportedLanguages from '../../src/components/i18n/languages.json';
import { expect } from '@playwright/test';
import config from '../config';

test.describe('Report History', () => {
  const url = '/cite/history?report_number=3206&incident_id=563';

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test('Should display the Report Version History table data', async ({ page }) => {
    await page.goto(url);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindReportHistory',
      reportHistory,
      'FindReportHistory'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindUsers',
      {
        data: {
          users: [
            { userId: '1', first_name: 'Sean', last_name: 'McGregor', roles: [] },
            { userId: '2', first_name: 'Pablo', last_name: 'Costa', roles: [] },
          ],
        },
      },
      'FindUsers'
    );

    await Promise.all([
      waitForRequest('FindReportHistory'),
      waitForRequest('FindUsers')
    ]);

    await expect(page.getByText('Version History')).toBeVisible({ timeout: 30000 });

    const rows = await page.locator('[data-cy="history-row"]').count();
    expect(rows).toBe(9);

    for (let index = 0; index < reportHistory.data.history_reports.length; index++) {
      const history = reportHistory.data.history_reports[index];
      await expect(page.locator('[data-cy="history-row"]').nth(index)).toContainText(
        `${format(fromUnixTime(history.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}`
      );
      await expect(page.locator('[data-cy="history-row"]').nth(index)).toContainText(
        `Modified by: ${history.modifiedBy === '1' ? 'Sean McGregor' : 'Pablo Costa'}`
      );
    }

    await expect(page.locator('[data-cy="history-row"]').last()).toContainText('Initial version');
  });

  test('Should not display the Report Version History table data if no data is present', async ({ page }) => {
    await page.goto(url);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindReportHistory',
      { data: { history_reports: [] } },
      'FindReportHistory'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindUsers',
      {
        data: {
          users: [
            { userId: '1', first_name: 'Sean', last_name: 'McGregor', roles: [] },
            { userId: '2', first_name: 'Pablo', last_name: 'Costa', roles: [] },
          ],
        },
      },
      'FindUsers'
    );

    await Promise.all([
      waitForRequest('FindReportHistory'),
      waitForRequest('FindUsers')
    ]);

    await expect(page.getByText('Version History')).not.toBeVisible();
    await expect(page.locator('[data-cy="history-table"]')).not.toBeVisible();
    await expect(page.getByText('There are no version history records for this Report')).toBeVisible({ timeout: 30000 });
  });

  test('Should go back to the Incident Report', async ({ page }) => {
    await page.goto(url);
    await expect(page.getByText('Back to Report 3206')).toBeVisible({ timeout: 30000 });
    await page.getByText('Back to Report 3206').click();
    await page.waitForURL('/cite/563/#r3206');
  });

  test('Should go back to the Issue Report', async ({ page }) => {
    await page.goto('/cite/history?report_number=3206&incident_id=null');
    await page.getByText('Back to Report 3206').click();
    await page.waitForURL('/reports/3206/');
  });

  test('Should refresh Report history if the user go back on the browser', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto('/cite/3/');

    await page.locator('button:has-text("Read More")').first().click();

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName === 'FindReportHistory',
      reportHistory,
      'FindReportHistory'
    );

    await page.locator('[data-cy="report-history-button"]').click();

    await waitForRequest('FindReportHistory');

    await expect(page).toHaveURL('/cite/history/?report_number=376&incident_id=3');

    await page.goBack();

    await expect(page).toHaveURL('/cite/3/');

    await page.goForward();

    await waitForRequest('FindReportHistory');
  });

  test('Should not be able to restore a version if the user does not have the right permissions', async ({ page }) => {
    await page.goto(url);
    await expect(page.getByText('Restore Version')).not.toBeVisible();
  });

  test('Should restore a Report previous version', async ({ page, login }) => {
    const userId = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    await page.goto(url);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindReport',
      {
        data: {
          report: reportHistory.data.history_reports[0],
        },
      },
      'FindReport'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindReportHistory',
      reportHistory,
      'FindReportHistory'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindUsers',
      {
        data: {
          users: [
            { userId: '1', first_name: 'Sean', last_name: 'McGregor', roles: [] },
            { userId: '2', first_name: 'Pablo', last_name: 'Costa', roles: [] },
          ],
        },
      },
      'FindUsers'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'UpdateReport',
      updateOneReport,
      'UpdateReport'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'logReportHistory',
      { data: { logReportHistory: { report_number: 3206 } } },
      'logReportHistory'
    );

    await Promise.all([
      waitForRequest('FindReportHistory'),
      waitForRequest('FindUsers'),
      waitForRequest('FindReport')
    ]);

    for (let index = 0; index < reportHistory.data.history_reports.length; index++) {
      if (index === 0) {
        await expect(page.locator('[data-cy="history-row"]').nth(index).locator('[data-cy="restore-button"]')).not.toBeVisible();
      } else {
        await expect(page.locator('[data-cy="history-row"]').nth(index).locator('[data-cy="restore-button"]')).toBeVisible();
      }
    }

    const now = new Date();
    await page.context().addInitScript(`Date = class extends Date {
    constructor() {
      super(${now.getTime()});
    }
  };`);

    // Listen for the dialog and handle it
    page.once('dialog', async dialog => {
      await dialog.accept();
    });

    await page.locator('[data-cy="history-row"]').last().locator('[data-cy="restore-button"]').click();
    await page.getByTestId('restoring-message').scrollIntoViewIfNeeded();
    await expect(page.getByTestId("restoring-message")).toBeVisible({ timeout: 30000 });

    const initialVersion = reportHistory.data.history_reports[reportHistory.data.history_reports.length - 1];

    const updatedReport = {
      ...initialVersion,
      epoch_date_modified: getUnixTime(new Date()),
      editor_notes: '',
    };

    delete updatedReport._id;
    delete updatedReport.modifiedBy;
    delete updatedReport.user;
    delete updatedReport.embedding.__typename;

    const updateReportRequest = await waitForRequest('UpdateReport');
    const variables = updateReportRequest.postDataJSON().variables;
    expect(variables.filter.report_number.EQ).toBe(updatedReport.report_number);
    expect(variables.update.set).toEqual(updatedReport);

    const logReportHistoryRequest = await waitForRequest('logReportHistory');
    const input = logReportHistoryRequest.postDataJSON().variables.input;

    const expectedReport = {
      ...initialVersion,
      editor_notes: updatedReport.editor_notes,
      epoch_date_modified: updatedReport.epoch_date_modified,
      modifiedBy: userId,
    };

    delete expectedReport._id;
    delete expectedReport.user;

    expect(input).toEqual(expectedReport);

    await page.locator('[data-cy="toast"]').waitFor({ timeout: 60000 });
    await expect(page.locator('[data-cy="toast"]')).toHaveText('Report version restored successfully.');

    await expect(page.locator('[data-cy="restoring-message"]')).not.toBeVisible();

    await waitForRequest('FindReportHistory');
  });

  test('Should display the Report Version History details modal', async ({ page }) => {
    await page.goto(url);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindReport',
      {
        data: {
          report: reportHistory.data.history_reports[0],
        },
      },
      'FindReport'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindReportHistory',
      reportHistory,
      'FindReportHistory'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindUsers',
      {
        data: {
          users: [
            {
              userId: '1', first_name: 'Sean', last_name:

                'McGregor', roles: []
            },
            { userId: '2', first_name: 'Pablo', last_name: 'Costa', roles: [] },
          ],
        },
      },
      'FindUsers'
    );

    await Promise.all([
      waitForRequest('FindReport'),
      waitForRequest('FindReportHistory'),
      waitForRequest('FindUsers')
    ]);

    await page.locator('[data-cy="history-row"]').nth(1).locator('[data-cy="view-full-version-button"]').click();

    await expect(page.locator('[data-cy="version-view-modal"]')).toBeVisible();

    const version = reportHistory.data.history_reports[1];

    await expect(page.getByText('Version details')).toBeVisible();
    await expect(page.getByText(`Modified on: ${format(fromUnixTime(version.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}`)).toBeVisible();
    await expect(page.locator('[data-cy="version-view-modal"] div').filter({ hasText: 'Modified by: Sean McGregor' }).first()).toBeVisible();


    const fields = [
      { label: 'Report Address:', value: version.url },
      { label: 'Title:', value: version.title },
      { label: 'Author CSV:', value: version.authors.join(', ') },
      { label: 'Submitter CSV:', value: version.submitters.join(', ') },
      { label: 'Date Published:', value: version.date_published },
      { label: 'Date Downloaded:', value: version.date_downloaded },
      { label: 'Image Address:', value: version.image_url },
      { label: 'Text:', value: 'By Aimee Picchi' },
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

    await page.locator('[data-cy="history-row"]').first().locator('[data-cy="view-full-version-button"]').click();

    await expect(page.locator('[data-cy="version-view-modal"]')).toBeVisible();

    const latestVersion = reportHistory.data.history_reports[0];

    await expect(page.getByText('Version details')).toBeVisible();
    await expect(page.getByText(`Modified on: ${format(fromUnixTime(latestVersion.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}`)).toBeVisible();
    await expect(page.locator('[data-cy="version-view-modal"] div').filter({ hasText: 'Modified by: Sean McGregor' }).first()).toBeVisible();

    for (const field of fields) {
      await expect(page.getByText(field.label)).toBeVisible();
      await expect(page.locator('[data-cy="version-view-modal"] div.col-span-6').filter({ hasText: 'Is Starbucks shortchanging its baristas? v2' }).first()).toBeVisible();
    }

    await expect(page.locator('[data-cy="version-view-modal"] [data-cy="cloudinary-image"]').nth(0)).toHaveAttribute('src', expect.stringContaining(version.cloudinary_id));
    await page.locator('[data-cy="version-view-modal"] button').filter({ hasText: 'Close' }).click();
    await expect(page.locator('[data-cy="version-view-modal"]')).not.toBeVisible();
  });
});