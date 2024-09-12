import { format, fromUnixTime, getUnixTime } from 'date-fns';
import incidentHistory from '../../fixtures/history/incidentHistory.json';
import versionReports from '../../fixtures/history/versionReports.json';
import { test, conditionalIntercept, waitForRequest, query } from '../../utils';
import { expect } from '@playwright/test';
import config from '../../config';
const { gql } = require('@apollo/client');

test.describe('Incidents', () => {
  const url = '/incidents/history/?incident_id=10';

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test('Should display the Version History table data', async ({ page }) => {
    await page.goto(url);

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindIncidentHistory', incidentHistory, 'FindIncidentHistory');
    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindUsers', {
      data: {
        users: [
          { userId: '1', first_name: 'Sean', last_name: 'McGregor', roles: [] },
          { userId: '2', first_name: 'Pablo', last_name: 'Costa', roles: [] },
        ],
      },
    }, 'FindUsers');
    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindEntities', {
      data: {
        entities: [
          { __typename: 'Entity', entity_id: 'youtube', name: 'Youtube' },
          { __typename: 'Entity', entity_id: 'google', name: 'Google' },
          { __typename: 'Entity', entity_id: 'tesla', name: 'Tesla' },
        ],
      },
    }, 'FindEntities');

    await Promise.all([
      waitForRequest('FindIncidentHistory'),
      waitForRequest('FindEntities'),
      waitForRequest('FindUsers')
    ]);

    await page.locator('h2').getByText('Version History').waitFor();
    const rows = await page.locator('[data-cy="history-row"]').elementHandles();
    expect(rows.length).toBe(4);

    for (let [index, history] of incidentHistory.data.history_incidents.entries()) {
      const row = rows[index];
      await row.evaluate((node, epoch_date_modified) => node.textContent.includes(`${new Date(epoch_date_modified * 1000).toISOString().slice(0, 16).replace('T', ' ')}`), history.epoch_date_modified);
      await row.evaluate((node, history) => node.textContent.includes(`Modified by: ${history.modifiedBy === '1' ? 'Sean McGregor' : 'Pablo Costa'}`), history);
    }

    const lastRowIndex = incidentHistory.data.history_incidents.length - 1;

    const lastRow = rows[lastRowIndex];
    await lastRow.evaluate((node) => node.textContent.includes('Initial version'));
  });

  test('Should not display the Version History table data if no data is present', async ({ page }) => {
    await page.goto(url);

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindIncidentHistory', { data: { history_incidents: [] } }, 'FindIncidentHistory');
    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindUsers', {
      data: {
        users: [
          { userId: '1', first_name: 'Sean', last_name: 'McGregor', roles: [] },
          { userId: '2', first_name: 'Pablo', last_name: 'Costa', roles: [] },
        ],
      },
    }, 'FindUsers');
    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindEntities', {
      data: {
        entities: [
          { __typename: 'Entity', entity_id: 'youtube', name: 'Youtube' },
          { __typename: 'Entity', entity_id: 'google', name: 'Google' },
          { __typename: 'Entity', entity_id: 'tesla', name: 'Tesla' },
        ],
      },
    }, 'FindEntities');

    await Promise.all([
      waitForRequest('FindIncidentHistory'),
      waitForRequest('FindEntities'),
      waitForRequest('FindUsers')
    ]);

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
    await page.getByText('Back to Incident 10').click();
    await page.waitForURL('/cite/10/');
  });

  test('Should not be able to restore a version if the user does not have the right permissions', async ({ page }) => {
    await page.goto(url);
    await page.getByText('Restore Version').waitFor({ state: 'hidden' });
  });

  test('Should restore an Incident previous version', async ({ page, login }) => {
    
    const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    await page.goto(url);

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindIncidentHistory', incidentHistory, 'FindIncidentHistory');
    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindUsers', {
      data: {
        users: [
          { userId: '1', first_name: 'Sean', last_name: 'McGregor', roles: [] },
          { userId: '2', first_name: 'Pablo', last_name: 'Costa', roles: [] },
        ],
      },
    }, 'FindUsers');
    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindEntities', {
      data: {
        entities: [
          { __typename: 'Entity', entity_id: 'youtube', name: 'Youtube' },
          { __typename: 'Entity', entity_id: 'google', name: 'Google' },
          { __typename: 'Entity', entity_id: 'tesla', name: 'Tesla' },
        ],
      },
    }, 'FindEntities');
    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'UpdateIncident', { data: { updateOneIncident: { incident_id: 10 } } }, 'UpdateIncident');
    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'logIncidentHistory', { data: { logIncidentHistory: { incident_id: 10 } } }, 'logIncidentHistory');

    await Promise.all([
      waitForRequest('FindIncidentHistory'),
      waitForRequest('FindEntities'),
      waitForRequest('FindUsers')
    ]);

    await page.locator('h2').getByText('Version History').waitFor();

    const rows = await page.locator('[data-cy="history-row"]').elementHandles();
    expect(rows.length).toBe(4);

    for (let [index, history] of incidentHistory.data.history_incidents.entries()) {
      const row = rows[index];
      await row.evaluate((node, epoch_date_modified) => {
        const formattedDate = new Date(epoch_date_modified * 1000).toISOString().slice(0, 16).replace('T', ' ');
        return node.textContent.includes(formattedDate);
      }, history.epoch_date_modified);
      await row.evaluate((node, history) => node.textContent.includes(`Modified by: ${history.modifiedBy === '1' ? 'Sean McGregor' : 'Pablo Costa'}`), history);
      if (index !== 0) {
        const restoreButton = await row.$('[data-cy="restore-button"]');
        if (restoreButton) {
          await restoreButton.waitForElementState('visible');
        }
      }
    }

    const lastRow = rows[incidentHistory.data.history_incidents.length - 1];
    await lastRow.evaluate((node) => node.textContent.includes('Initial version'));

    const now = new Date();
    await page.context().addInitScript(`Date = class extends Date {
      constructor() {
        super(${now.getTime()});
      }
    };`);

    const restoreButton = await lastRow.$('[data-cy="restore-button"]');

    // Listen for the dialog and handle it
    page.once('dialog', async dialog => {
      await dialog.accept();
    });

    if (restoreButton) {
      await restoreButton.click();
    }

    await page.getByTestId("restoring-message").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("restoring-message")).toBeVisible({ timeout: 30000 });

    const initialVersion = incidentHistory.data.history_incidents[incidentHistory.data.history_incidents.length - 1];
    const updatedIncident = {
      ...initialVersion,
      epoch_date_modified: expect.any(Number),
      editor_notes: '',
      reports: { link: initialVersion.reports },
      AllegedDeployerOfAISystem: { link: initialVersion.AllegedDeployerOfAISystem },
      AllegedDeveloperOfAISystem: { link: initialVersion.AllegedDeveloperOfAISystem },
      AllegedHarmedOrNearlyHarmedParties: { link: initialVersion.AllegedHarmedOrNearlyHarmedParties },
      editors: { link: initialVersion.editors.concat(userId) },
    };

    delete updatedIncident._id;
    delete updatedIncident.modifiedBy;

    const updateIncidentRequest = await waitForRequest('UpdateIncident');
    const updateIncidentVariables = updateIncidentRequest.postDataJSON().variables;
    expect(updateIncidentVariables.filter.incident_id.EQ).toBe(updatedIncident.incident_id);
    expect(updateIncidentVariables.update.set).toMatchObject(updatedIncident);

    const logIncidentHistoryRequest = await waitForRequest('logIncidentHistory');
    const logIncidentHistoryInput = logIncidentHistoryRequest.postDataJSON().variables.input;

    const expectedIncident = {
      ...initialVersion,
      editor_notes: updatedIncident.editor_notes,
      epoch_date_modified: updatedIncident.epoch_date_modified,
      editors: initialVersion.editors.concat(userId),
      modifiedBy: userId,
    };

    delete expectedIncident._id;

    expect(logIncidentHistoryInput).toEqual(expectedIncident);

    await page.getByText('Incident version restored successfully.').waitFor();
    await page.locator('[data-cy="restoring-message"]').waitFor({ state: 'hidden' });
  });

  test('Should display the Version History details modal', async ({ page }) => {



    await page.goto(url);

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindIncidentHistory', incidentHistory, 'FindIncidentHistory');
    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindUsers', {
      data: {
        users: [
          { userId: '1', first_name: 'Sean', last_name: 'McGregor', roles: [] },
          { userId: '2', first_name: 'Pablo', last_name: 'Costa', roles: [] },
        ],
      },
    }, 'FindUsers');
    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindEntities', {
      data: {
        entities: [
          { __typename: 'Entity', entity_id: 'youtube', name: 'Youtube' },
          { __typename: 'Entity', entity_id: 'google', name: 'Google' },
          { __typename: 'Entity', entity_id: 'tesla', name: 'Tesla' },
        ],
      },
    }, 'FindEntities');
    const filteredVersionReports = {
      data: { reports: versionReports.data.reports.filter((report: any) => incidentHistory.data.history_incidents[1].reports.includes(report.report_number)) }
    };
    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindReports' && req.postDataJSON().variables.filter?.report_number.IN.length === 1, filteredVersionReports, 'FindReportsV1');

    await Promise.all([
      waitForRequest('FindIncidentHistory'),
      waitForRequest('FindEntities'),
      waitForRequest('FindUsers')
    ]);

    const rows = await page.locator('[data-cy="history-row"]');

    await rows.nth(1).locator('[data-cy="view-full-version-button"]').click();

    const findReportsRequestV1 = await waitForRequest('FindReportsV1');
    expect(findReportsRequestV1.postDataJSON().variables.filter).toEqual({
      report_number: { IN: incidentHistory.data.history_incidents[1].reports, }
    });

    const modal = page.locator('[data-cy="version-view-modal"]');
    await modal.waitFor();

    const version1 = incidentHistory.data.history_incidents[1];
    await modal.getByText('View Version details').waitFor();
    await modal.getByText(version1.title).waitFor();
    await modal.getByText('Modified by: Sean McGregor').waitFor();
    await modal.getByText(`Modified on: ${format(fromUnixTime(version1.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}`).waitFor();
    await modal.getByText(`Description: ${version1.description}`).waitFor();
    if (version1.editor_notes) {
      await modal.getByText(`Editor Notes: ${version1.editor_notes}`).waitFor();
    }
    await modal.locator('[data-cy="alleged-entities"]').getByText('Alleged: developed an AI system deployed by Youtube, which harmed Google.').waitFor();
    await modal.locator('[data-cy="citation"]').getByText(`${version1.incident_id}`).waitFor();
    await modal.locator('[data-cy="citation"]').getByText(`${version1.reports.length}`, { exact: true }).waitFor();
    await modal.locator('[data-cy="citation"]').getByText(`${version1.date}`).waitFor();
    await modal.locator('[data-cy="citation"]').getByText('Sean McGregor, Pablo Costa').waitFor();
    await modal.locator('button').getByText('Close').click();
    await modal.waitFor({ state: 'hidden' });

    const filteredVersionReportsV0 = {
      data: {
        reports: versionReports.data.reports.filter((report: any) => incidentHistory.data.history_incidents[0].reports.includes(report.report_number))
      }
    };
    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindReports' && req.postDataJSON().variables.filter?.report_number.IN.length === 2, filteredVersionReportsV0, 'FindReportsV0');

    await rows.nth(0).locator('[data-cy="view-full-version-button"]').click();

    const findReportsRequestV0 = await waitForRequest('FindReportsV0');
    expect(findReportsRequestV0.postDataJSON().variables.filter).toEqual({
      report_number: { IN: incidentHistory.data.history_incidents[0].reports },
    });

    await modal.waitFor();

    const version0 = incidentHistory.data.history_incidents[0];
    await modal.getByText('View Version details').waitFor();
    await modal.getByText(version0.title).waitFor();
    await modal.getByText('Modified by: Sean McGregor').waitFor();
    await modal.getByText(`Modified on: ${format(fromUnixTime(version0.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}`).waitFor();
    await modal.getByText(`Description: ${version0.description}`).waitFor();
    if (version0.editor_notes) {
      await modal.getByText(`Editor Notes: ${version0.editor_notes}`).waitFor();
    }
    await modal.locator('[data-cy="alleged-entities"]').getByText('Alleged: developed an AI system deployed by Youtube, which harmed Google.').waitFor();
    await modal.locator('[data-cy="citation"]').getByText(`${version0.incident_id}`).waitFor();
    await modal.locator('[data-cy="citation"]').getByText(`${version0.reports.length}`, { exact: true }).waitFor();
    await modal.locator('[data-cy="citation"]').getByText(`${version0.date}`).waitFor();
    await modal.locator('[data-cy="citation"]').getByText('Sean McGregor, Pablo Costa').waitFor();
    await modal.locator('button').getByText('Close').click();
    await modal.waitFor({ state: 'hidden' });
  });
});
