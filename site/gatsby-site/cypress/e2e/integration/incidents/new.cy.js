import { maybeIt } from '../../../support/utils';
import incident from '../../../fixtures/incidents/incident.json';
import incidents from '../../../fixtures/incidents/incidents.json';
import updateOneIncident from '../../../fixtures/incidents/updateOneIncident.json';
import { getUnixTime } from 'date-fns';
const { gql } = require('@apollo/client');

describe('New Incident page', () => {
  const url = '/incidents/new';

  let user;

  before('before', () => {
    cy.query({
      query: gql`
        {
          users {
            userId
            first_name
            last_name
          }
        }
      `,
    }).then(({ data: { users } }) => {
      user = users.find((u) => u.first_name == 'Test' && u.last_name == 'User');
    });
  });

  it('Successfully loads', () => {
    cy.visit(url);
  });

  maybeIt('Should successfully create a new incident', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const newIncidentId = incidents.data.incidents[0].incident_id + 1;

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncident',
      'findIncident',
      {
        data: {
          incident: null,
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidents',
      'GetLatestIncidentId',
      incidents
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'IncidentWithReports',
      'IncidentWithReports',
      { data: { incidents: [] } }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'UpsertEntity' &&
        req.body.variables.entity.entity_id == 'youtube',
      'UpsertYoutube',
      { data: { upsertOneEntity: { __typename: 'Entity', entity_id: 'youtube', name: 'YouTube' } } }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'UpsertEntity' &&
        req.body.variables.entity.entity_id == 'test-deployer',
      'UpsertDeployer',
      {
        data: {
          upsertOneEntity: {
            __typename: 'Entity',
            entity_id: 'test-deployer',
            name: 'Test Deployer',
          },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'UpsertEntity' &&
        req.body.variables.entity.entity_id == 'children',
      'UpsertChildren',
      {
        data: {
          upsertOneEntity: { __typename: 'Entity', entity_id: 'children', name: 'Children' },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindEntities',
      'FindEntities',
      {
        data: {
          entities: [
            { __typename: 'Entity', entity_id: 'Youtube', name: 'youtube' },
            { __typename: 'Entity', entity_id: 'Children', name: 'children' },
          ],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUsers',
      'FindUsers',
      {
        data: {
          users: [
            { userId: '1', first_name: 'Sean', last_name: 'McGregor' },
            { userId: '2', first_name: 'Pablo', last_name: 'Costa' },
          ],
        },
      }
    );

    cy.visit(url);

    cy.wait(['@GetLatestIncidentId', '@FindEntities', '@FindUsers', '@findIncident'], {
      timeout: 30000,
    });

    const values = {
      title: 'Test title',
      description: 'Test description',
      date: '2021-01-02',
    };

    Object.keys(values).forEach((key) => {
      cy.get(`[name=${key}]`).clear().type(values[key]);
    });

    cy.get('[data-cy="alleged-deployer-of-ai-system-input"] input')
      .first()
      .type('Test Deployer{enter}');

    cy.get('[data-cy="alleged-developer-of-ai-system-input"] input').first().type('youtube{enter}');

    cy.get('[data-cy="alleged-harmed-or-nearly-harmed-parties-input"] input')
      .first()
      .type('children{enter}');

    cy.get('#input-editors').type('Pablo');

    cy.get('[aria-label="Pablo Costa"]').click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'InsertIncident',
      'InsertIncident',
      {
        data: {
          insertOneIncident: {
            incident_id: newIncidentId,
          },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'logIncidentHistory',
      'logIncidentHistory',
      {
        data: {
          logIncidentHistory: {
            incident_id: newIncidentId,
          },
        },
      }
    );

    const now = new Date();

    cy.clock(now);

    cy.contains('button', 'Save').click();

    cy.wait('@UpsertYoutube')
      .its('request.body.variables.entity.entity_id')
      .should('eq', 'youtube');

    cy.wait('@UpsertDeployer')
      .its('request.body.variables.entity.entity_id')
      .should('eq', 'test-deployer');

    cy.wait('@UpsertChildren')
      .its('request.body.variables.entity.entity_id')
      .should('eq', 'children');

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
      nlp_similar_incidents: [],
      editor_similar_incidents: [],
      editor_dissimilar_incidents: [],
      embedding: {},
    };

    cy.wait('@InsertIncident').then((xhr) => {
      expect(xhr.request.body.operationName).to.eq('InsertIncident');
      expect(xhr.request.body.variables.incident).to.deep.eq(newIncident);
    });

    cy.wait('@logIncidentHistory')
      .its('request.body.variables.input')
      .then((input) => {
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

        expect(input).to.deep.eq(expectedIncident);
      });

    cy.get('.tw-toast')
      .contains(`You have successfully create Incident ${newIncidentId}. View incident`)
      .should('exist');
  });

  maybeIt('Should clone an incident', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const newIncidentId = incidents.data.incidents[0].incident_id + 1;

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncident',
      'findIncident',
      incident
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidents',
      'GetLatestIncidentId',
      incidents
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'IncidentWithReports',
      'IncidentWithReports',
      { data: { incidents: [] } }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'UpsertEntity' &&
        req.body.variables.entity.entity_id == 'youtube',
      'UpsertYoutube',
      { data: { upsertOneEntity: { __typename: 'Entity', entity_id: 'youtube', name: 'YouTube' } } }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'UpsertEntity' &&
        req.body.variables.entity.entity_id == 'children',
      'UpsertChildren',
      {
        data: {
          upsertOneEntity: { __typename: 'Entity', entity_id: 'children', name: 'Children' },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindEntities',
      'FindEntities',
      {
        data: {
          entities: [
            { __typename: 'Entity', entity_id: 'Youtube', name: 'youtube' },
            { __typename: 'Entity', entity_id: 'Children', name: 'children' },
          ],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUsers',
      'FindUsers',
      {
        data: {
          users: [
            { userId: '1', first_name: 'Sean', last_name: 'McGregor' },
            { userId: '2', first_name: 'Pablo', last_name: 'Costa' },
          ],
        },
      }
    );

    cy.visit(`${url}/?incident_id=1`);

    cy.wait(['@GetLatestIncidentId', '@FindEntities', '@FindUsers', '@findIncident'], {
      timeout: 30000,
    });

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'InsertIncident',
      'InsertIncident',
      { data: { insertOneIncident: updateOneIncident.data.updateOneIncident } }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'logIncidentHistory',
      'logIncidentHistory',
      {
        data: {
          logIncidentHistory: {
            incident_id: newIncidentId,
          },
        },
      }
    );

    const now = new Date();

    cy.clock(now);

    cy.contains('button', 'Save').click();

    cy.wait('@UpsertYoutube')
      .its('request.body.variables.entity.entity_id')
      .should('eq', 'youtube');

    cy.wait('@UpsertYoutube')
      .its('request.body.variables.entity.entity_id')
      .should('eq', 'youtube');

    cy.wait('@UpsertChildren')
      .its('request.body.variables.entity.entity_id')
      .should('eq', 'children');

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

    cy.wait('@InsertIncident').then((xhr) => {
      expect(xhr.request.body.operationName).to.eq('InsertIncident');
      expect(xhr.request.body.variables.incident).to.deep.eq(newIncident);
    });

    cy.wait('@logIncidentHistory')
      .its('request.body.variables.input')
      .then((input) => {
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

        expect(input).to.deep.eq(expectedIncident);
      });

    cy.get('.tw-toast')
      .contains(`You have successfully create Incident ${newIncidentId}. View incident`)
      .should('exist');
  });
});
