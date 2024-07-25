import incident from '../../fixtures/incidents/incident.json';
import updateOneIncident from '../../fixtures/incidents/updateOneIncident.json';
import { gql } from '@apollo/client';
import { expect } from '@playwright/test';
import { conditionalIntercept, waitForRequest, query, test } from '../../utils';
import config from '../../config';
import { getUnixTime } from 'date-fns';
import { transformIncidentData, deleteIncidentTypenames } from '../../../src/utils/cite';

test.describe('Incidents', () => {
  const url = '/incidents/edit?incident_id=10';

  let user;

  test.beforeAll(async ({ }) => {
    const { data: { user: userData } } = await query({
      query: gql`
        {
          user(query: { first_name: "Test", last_name: "User" }) {
            userId
            first_name
            last_name
          }
        }
      `,
    });
    user = userData;
  });

  test('Should successfully edit incident fields', async ({ page, login }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    await page.goto(url);

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindIncident', incident, 'FindIncident');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindUsers', {
      data: {
        users: [
          { userId: '1', first_name: 'Sean', last_name: 'McGregor' },
          { userId: '2', first_name: 'Pablo', last_name: 'Costa' },
        ],
      },
    }, 'FindUsers');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'IncidentWithReports', { data: { incidents: [] } }, 'IncidentWithReports');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'UpsertEntity' && req.postDataJSON()?.variables?.entity?.entity_id == 'youtube', {
      data: { upsertOneEntity: { __typename: 'Entity', entity_id: 'youtube', name: 'YouTube' } }
    }, 'UpsertYoutube');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'UpsertEntity' && req.postDataJSON()?.variables?.entity?.entity_id == 'test-deployer', {
      data: {
        upsertOneEntity: {
          __typename: 'Entity',
          entity_id: 'test-deployer',
          name: 'Test Deployer',
        },
      },
    }, 'UpsertDeployer');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'UpsertEntity' && req.postDataJSON()?.variables?.entity?.entity_id == 'children', {
      data: {
        upsertOneEntity: { __typename: 'Entity', entity_id: 'children', name: 'Children' },
      },
    }, 'UpsertChildren');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindEntities', {
      data: {
        entities: [
          { __typename: 'Entity', entity_id: 'Youtube', name: 'youtube' },
          { __typename: 'Entity', entity_id: 'Children', name: 'children' },
        ],
      },
    }, 'FindEntities');

    await waitForRequest('FindIncident');
    await waitForRequest('FindEntities');
    await waitForRequest('FindUsers');
    await waitForRequest('IncidentWithReports');


    const values = {
      title: 'Test title',
      description: 'Test description',
      date: '2021-01-02',
      editor_notes: 'Test editor notes',
    };

    for (const key in values) {
      await page.locator(`[name=${key}]`).fill(values[key]);
    }

    await page.locator('[data-cy="alleged-deployer-of-ai-system-input"] input').first().fill('Test Deployer');
    await page.keyboard.press('Enter');
    await page.locator('#input-editors').fill('Pablo');
    await page.locator('[aria-label="Pablo Costa"]').click();

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'UpdateIncident', updateOneIncident, 'UpdateIncident');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'logIncidentHistory', {
      data: {
        logIncidentHistory: {
          incident_id: 112,
        },
      },
    }, 'logIncidentHistory');

    await page.getByText('Save', { exact: true }).click();

    const upsertYoutubeRequest = await waitForRequest('UpsertYoutube');
    expect(upsertYoutubeRequest.postDataJSON().variables.entity.entity_id).toBe('youtube');

    const upsertDeployerRequest = await waitForRequest('UpsertDeployer');
    expect(upsertDeployerRequest.postDataJSON().variables.entity.entity_id).toBe('test-deployer');

    const now = new Date();
    await page.context().addInitScript(`Date = class extends Date {
      constructor() {
        super(${now.getTime()});
      }
    };`);

    const upsertChildrenRequest = await waitForRequest('UpsertChildren');
    expect(upsertChildrenRequest.postDataJSON().variables.entity.entity_id).toBe('children');

    const updateIncidentRequest = await waitForRequest('UpdateIncident');
    const updatedIncident = {
      incident_id: incident.data.incident.incident_id,
      title: 'Test title',
      description: 'Test description',
      date: '2021-01-02',
      AllegedDeployerOfAISystem: { link: ['youtube', 'test-deployer'] },
      AllegedDeveloperOfAISystem: { link: ['youtube'] },
      AllegedHarmedOrNearlyHarmedParties: { link: ['children'] },
      editors: { link: ['1', '2', user.userId] },
      nlp_similar_incidents: incident.data.incident.nlp_similar_incidents,
      flagged_dissimilar_incidents: incident.data.incident.flagged_dissimilar_incidents,
      editor_dissimilar_incidents: incident.data.incident.editor_dissimilar_incidents,
      editor_similar_incidents: incident.data.incident.editor_similar_incidents,
      embedding: incident.data.incident.embedding,
      editor_notes: 'Test editor notes',
      epoch_date_modified: getUnixTime(now),
      tsne: incident.data.incident.tsne,
    };
    expect(updateIncidentRequest.postDataJSON().variables.set).toEqual(updatedIncident);

    const logIncidentHistoryRequest = await waitForRequest('logIncidentHistory');
    const input = logIncidentHistoryRequest.postDataJSON().variables.input;

    const expectedIncident = deleteIncidentTypenames(
      transformIncidentData(
        {
          ...incident.data.incident,
          ...updatedIncident,
        },
        user
      )
    );

    expectedIncident.modifiedBy = user.userId;
    expect(input).toEqual(expectedIncident);

    await page.locator('.tw-toast:has-text("Incident 10 updated successfully.")').isVisible();
  });
});
