import { format, fromUnixTime } from 'date-fns';
import { test, query } from '../../utils';
import { expect } from '@playwright/test';
import { init } from '../../memory-mongo';
const { gql } = require('@apollo/client');

test.describe('Incidents', () => {
  const url = '/incidents/history/?incident_id=1';
  const urlNoHistory = '/incidents/history/?incident_id=2';

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test('Should display the Version History table data', async ({ page }) => {

    await init();

    const { data: { history_incidents } } = await query({
      query: gql`
        query {
          history_incidents {
            incident_id
            epoch_date_modified
            modifiedBy
          }
        }
      `
    });

    await page.goto(url);

    await page.locator('h2').getByText('Version History').waitFor();

    await page.locator('[data-cy="history-table"]').waitFor();

    const rows = await page.locator('[data-cy="history-row"]').elementHandles();
    expect(rows.length).toBe(4);

    for (let [index, history] of history_incidents.entries()) {
      const row = rows[index];
      await row.evaluate((node, epoch_date_modified) => node.textContent.includes(`${new Date(epoch_date_modified * 1000).toISOString().slice(0, 16).replace('T', ' ')}`), history.epoch_date_modified);
      await row.evaluate((node, history) => node.textContent.includes(`Modified by: ${history.modifiedBy === '1' ? 'John Doe' : 'Test User'}`), history);
    }

    const lastRowIndex = history_incidents.length - 1;

    const lastRow = rows[lastRowIndex];
    await lastRow.evaluate((node) => node.textContent.includes('Initial version'));
  });

  test('Should not display the Version History table data if no data is present', async ({ page }) => {
    await page.goto(urlNoHistory);

    await page.locator('h2').getByText('Version History').waitFor({ state: 'hidden' });
    await page.locator('[data-cy="history-table"]').waitFor({ state: 'hidden' });
    await page.getByText('There are no version history records for this Incident').waitFor();
  });

  test('Should display an error message if no Incident ID is provided', async ({ page }) => {
    await page.goto('/incidents/history?incident_id=');
    await page.getByText('Invalid Incident ID').waitFor();
  });

  test('Should display an error message if an invalid Incident ID is provided', async ({ page }) => {
    await page.goto('/incidents/history?incident_id=xxx');
    await page.getByText('Invalid Incident ID').waitFor();
  });

  test('Should go back to the Incident', async ({ page }) => {
    await page.goto(url);
    await page.getByText('Back to Incident 1').click();
    await page.waitForURL('/cite/1/');
  });

  test('Should not be able to restore a version if the user does not have the right permissions', async ({ page }) => {
    await page.goto(url);
    await page.getByText('Restore Version').waitFor({ state: 'hidden' });
  });

  test('Should restore an Incident previous version', async ({ page, login }) => {

    await init();

    const { data: { history_incidents } } = await query({
      query: gql`
        query {
          history_incidents {
            title
            description
            reports
            incident_id
            epoch_date_modified
            modifiedBy
            editors
          }
        }
      `
    });

    await login();

    await page.goto(url);

    await expect(page.locator('h2').getByText('Version History')).toBeVisible();

    await expect(page.locator('[data-cy="history-row"]')).toHaveCount(4);


    page.once('dialog', async dialog => {
      await dialog.accept();
    });

    await page.locator('[data-cy="history-row"] [data-cy="restore-button"]').last().click();


    await expect(page.getByTestId("restoring-message")).toBeVisible();

    await expect(page.getByText('Incident version restored successfully.')).toBeVisible();

    await expect(page.locator('[data-cy="restoring-message"]')).not.toBeVisible();

    const { data: { incident } } = await query({
      query: gql`
        query {
          incident(filter: {incident_id: { EQ: 1 }}) {
            title
            description
            reports {
              report_number
            }
            date
            editor_notes
            epoch_date_modified
            editors {
              userId
            }
          }
        }
      `
    });

    const restoredIncident = history_incidents[0];

    expect(incident.title).toBe(restoredIncident.title);
    expect(incident.description).toBe(restoredIncident.description);
    expect(incident.reports.length).toBe(restoredIncident.reports.length);
  });

  test('Should display the Version History details modal', async ({ page }) => {

    await init();

    const { data: { history_incidents } } = await query({
      query: gql`
        query {
          history_incidents(sort: {epoch_date_modified: DESC}) {
            title
            incident_id
            epoch_date_modified
            modifiedBy
            description
            reports
            date
          }
        }
      `
    });

    await page.goto(url);

    await page.locator('[data-cy="history-row"]').first().waitFor();

    const rows = await page.locator('[data-cy="history-row"]');

    await rows.nth(0).locator('[data-cy="view-full-version-button"]').click();

    const modal = page.locator('[data-cy="version-view-modal"]');
    await modal.waitFor();

    const version1 = history_incidents[0];
    await modal.getByText('View Version details').waitFor();
    await modal.getByTestId('incident-title').getByText(version1.title).waitFor();
    await modal.getByText('Modified by: Test User').waitFor();
    await modal.getByText(`Modified on: ${format(fromUnixTime(version1.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}`).waitFor();
    await modal.locator('[data-testid="incident-description-section"]').getByText(`${version1.description}`).waitFor();
    if (version1.editor_notes) {
      await modal.getByText(`Editor Notes: ${version1.editor_notes}`).waitFor();
    }
    await modal.locator('[data-cy="alleged-entities"]').getByText('Alleged: Entity 2 developed an AI system deployed by Entity 1, which harmed Entity 3.').waitFor();
    await modal.locator('[data-cy="citation"]').getByTestId('Incident ID').getByText(`${version1.incident_id}`).waitFor();
    await modal.locator('[data-cy="citation"]').getByTestId('Report Count').getByText(`${version1.reports.length}`, { exact: true }).waitFor();
    await modal.locator('[data-cy="citation"]').getByTestId('Incident Date').getByText(`${version1.date}`).waitFor();
    await modal.locator('[data-cy="citation"]').getByTestId('Editors').getByText('Test User, John Doe').waitFor();
    await modal.locator('button').getByText('Close').click();
    await modal.waitFor({ state: 'hidden' });
  });
});