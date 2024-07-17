import { test, conditionalIntercept, waitForRequest, query } from '../../utils';
import { getUnixTime } from 'date-fns';
import incident from '../../fixtures/incidents/incident.json';
import incidents from '../../fixtures/incidents/incidents.json';
import updateOneIncident from '../../fixtures/incidents/updateOneIncident.json';
import { gql } from '@apollo/client';
import config from '../../config';
import { expect } from '@playwright/test';

test.describe('New Incident page', () => {
  const url = '/incidents/new';

  let user;

  test.beforeAll(async () => {
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

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test('Should successfully create a new incident', async ({ page, login }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    const newIncidentId = incidents.data.incidents[0].incident_id + 1;

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindIncident', { data: { incident: null } }, 'findIncident');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindIncidents', incidents, 'GetLatestIncidentId');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'IncidentWithReports', { data: { incidents: [] } }, 'IncidentWithReports');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'UpsertEntity' && req.postDataJSON()?.variables?.entity?.entity_id== 'youtube', { data: { upsertOneEntity: { __typename: 'Entity', entity_id: 'youtube', name: 'YouTube' } } }, 'UpsertYoutube');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'UpsertEntity' && req.postDataJSON()?.variables?.entity?.entity_id == 'test-deployer', { data: { upsertOneEntity: { __typename: 'Entity', entity_id: 'test-deployer', name: 'Test Deployer' } } }, 'UpsertDeployer');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'UpsertEntity' && req.postDataJSON()?.variables?.entity?.entity_id == 'children', { data: { upsertOneEntity: { __typename: 'Entity', entity_id: 'children', name: 'Children' } } }, 'UpsertChildren');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindEntities', {
      data: {
        entities: [
          { __typename: 'Entity', entity_id: 'Youtube', name: 'youtube' },
          { __typename: 'Entity', entity_id: 'Children', name: 'children' },
        ],
      },
    }, 'FindEntities');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindUsers', {
      data: {
        users: [
          { userId: '1', first_name: 'Sean', last_name: 'McGregor' },
          { userId: '2', first_name: 'Pablo', last_name: 'Costa' },
        ],
      },
    }, 'FindUsers');

    await page.goto(url);

    await Promise.all([
      waitForRequest('GetLatestIncidentId'),
      waitForRequest('FindEntities'),
      waitForRequest('FindUsers'),
      waitForRequest('findIncident'),
      waitForRequest('IncidentWithReports'),
    ]);

    const values = {
      title: 'Test title',
      description: 'Test description',
      date: '2021-01-02',
    };

    for (const [key, value] of Object.entries(values)) {
      await page.locator(`[name=${key}]`).fill(value);
    }

    await page.locator('[data-cy="alleged-deployer-of-ai-system-input"] input').first().fill('Test Deployer');
    await page.keyboard.press('Enter');
    await page.locator('[data-cy="alleged-developer-of-ai-system-input"] input').first().fill('youtube');
    await page.keyboard.press('Enter');
    await page.locator('[data-cy="alleged-harmed-or-nearly-harmed-parties-input"] input').first().fill('children');
    await page.keyboard.press('Enter');

    await page.locator('#input-editors').fill('Pablo');
    await page.getByText('Pablo Costa').click();

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'InsertIncident', { data: { insertOneIncident: { incident_id: newIncidentId } } }, 'InsertIncident');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'logIncidentHistory', { data: { logIncidentHistory: { incident_id: newIncidentId } } }, 'logIncidentHistory');

    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    

    await page.getByText('Save').click();

    const upsertYoutubeRequest = await waitForRequest('UpsertYoutube');
    expect(upsertYoutubeRequest.postDataJSON().variables.entity.entity_id).toBe('youtube');

    const upsertDeployerRequest = await waitForRequest('UpsertDeployer');
    expect(upsertDeployerRequest.postDataJSON().variables.entity.entity_id).toBe('test-deployer');

    const upsertChildrenRequest = await waitForRequest('UpsertChildren');
    expect(upsertChildrenRequest.postDataJSON().variables.entity.entity_id).toBe('children');

    const newIncident = {
      title: 'Test title',
      description: 'Test description',
      incident_id: newIncidentId,
      reports: { link: [] },
      editors: { link: ['2'] },
      date: '2021-01-02',
      AllegedDeployerOfAISystem: { link: ['test-deployer'] },
      AllegedDeveloperOfAISystem: { link: ['youtube'] },
      AllegedHarmedOrNearlyHarmedParties: { link: ['children'] },
      // nlp_similar_incidents: [],
      editor_similar_incidents: [],
      editor_dissimilar_incidents: [],
      embedding: {},
    };

    const insertIncidentRequest = await waitForRequest('InsertIncident');
    expect(insertIncidentRequest.postDataJSON().variables.incident).toEqual(newIncident);
    
    const now = new Date();
    await page.context().addInitScript(`Date = class extends Date {
      constructor() {
        super(${now.getTime()});
      }
    };`);

    const logIncidentHistoryRequest = await waitForRequest('logIncidentHistory');
    const input = logIncidentHistoryRequest.postDataJSON().variables.input;
    const expectedIncident = {
      ...newIncident,
      epoch_date_modified: getUnixTime(now),
      modifiedBy: user.userId,
      reports: [],
      editors: ['2'],
      AllegedDeployerOfAISystem: ['test-deployer'],
      AllegedDeveloperOfAISystem: ['youtube'],
      AllegedHarmedOrNearlyHarmedParties: ['children'],
    };

    expect(input).toEqual(expectedIncident);

    await page.getByText(`You have successfully create Incident ${newIncidentId}. View incident`).waitFor();
  });

  test('Should clone an incident', async ({ page, login }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    const newIncidentId = incidents.data.incidents[0].incident_id + 1;

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindIncident', incident, 'findIncident');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindIncidents', incidents, 'GetLatestIncidentId');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'IncidentWithReports', { data: { incidents: [] } }, 'IncidentWithReports');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'UpsertEntity' && req.postDataJSON().variables.entity.entity_id == 'youtube', { data: { upsertOneEntity: { __typename: 'Entity', entity_id: 'youtube', name: 'YouTube' } } }, 'UpsertYoutube');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'UpsertEntity' && req.postDataJSON().variables.entity.entity_id == 'children', { data: { upsertOneEntity: { __typename: 'Entity', entity_id: 'children', name: 'Children' } } }, 'UpsertChildren');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindEntities', {
      data: {
        entities: [
          { __typename: 'Entity', entity_id: 'Youtube', name: 'youtube' },
          { __typename: 'Entity', entity_id: 'Children', name: 'children' },
        ],
      },
    }, 'FindEntities');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'FindUsers', {
      data: {
        users: [
          { userId: '1', first_name: 'Sean', last_name: 'McGregor' },
          { userId: '2', first_name: 'Pablo', last_name: 'Costa' },
        ],
      },
    }, 'FindUsers');

    await page.goto(`${url}/?incident_id=1`);

    await Promise.all([
      waitForRequest('GetLatestIncidentId'),
      waitForRequest('FindEntities'),
      waitForRequest('FindUsers'),
      waitForRequest('findIncident'),
      waitForRequest('IncidentWithReports'),
    ]);

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'InsertIncident', { data: { insertOneIncident: updateOneIncident.data.updateOneIncident } }, 'InsertIncident');

    await conditionalIntercept(page, '**/graphql', (req) => req.postDataJSON().operationName == 'logIncidentHistory', { data: { logIncidentHistory: { incident_id: newIncidentId } } }, 'logIncidentHistory');

    
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await page.getByText('Save').click();
    
    const upsertYoutubeRequest = await waitForRequest('UpsertYoutube');
    expect(upsertYoutubeRequest.postDataJSON().variables.entity.entity_id).toBe('youtube');

    
    const upsertChildrenRequest = await waitForRequest('UpsertChildren');
    expect(upsertChildrenRequest.postDataJSON().variables.entity.entity_id).toBe('children');
    
    const newIncident = {
      title: incident.data.incident.title,
      description: incident.data.incident.description,
      incident_id: newIncidentId,
      reports: { link: [] },
      editors: { link: incident.data.incident.editors.map((e) => e.userId) },
      date: incident.data.incident.date,
      AllegedDeployerOfAISystem: {
        link: incident.data.incident.AllegedDeployerOfAISystem.map((entity) => entity.entity_id),
      },
      AllegedDeveloperOfAISystem: {
        link: incident.data.incident.AllegedDeveloperOfAISystem.map((entity) => entity.entity_id),
      },
      AllegedHarmedOrNearlyHarmedParties: {
        link: incident.data.incident.AllegedHarmedOrNearlyHarmedParties.map(
          (entity) => entity.entity_id
        ),
      },
      editor_similar_incidents: [],
      editor_dissimilar_incidents: [],
      embedding: {},
      editor_notes: incident.data.incident.editor_notes,
    };

    
    const insertIncidentRequest = await waitForRequest('InsertIncident');
    const now = new Date();
    await page.context().addInitScript(`Date = class extends Date {
      constructor() {
        super(${now.getTime()});
      }
    };`);
    expect(insertIncidentRequest.postDataJSON().variables.incident).toEqual(newIncident);

    const logIncidentHistoryRequest = await waitForRequest('logIncidentHistory');
    const input = logIncidentHistoryRequest.postDataJSON().variables.input;
    const expectedIncident = {
      ...newIncident,
      epoch_date_modified: getUnixTime(now),
      modifiedBy: user.userId,
      reports: [],
      editors: ['1'],
      AllegedDeployerOfAISystem: ['youtube'],
      AllegedDeveloperOfAISystem: ['youtube'],
      AllegedHarmedOrNearlyHarmedParties: ['children'],
    };

    expect(input).toEqual(expectedIncident);

    await page.getByText(`You have successfully create Incident ${newIncidentId}. View incident`).waitFor();
  });
});
