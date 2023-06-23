import { maybeIt } from '../../../support/utils';

import incidents from '../../../fixtures/incidents/incidents.json';

import { getUnixTime } from 'date-fns';

describe('New Incident page', () => {
  const url = '/incidents/new';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  maybeIt('Should successfully create a new incident', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const newIncidentId = incidents.data.incidents[0].incident_id + 1;

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

    cy.visit(url);

    cy.wait(['@GetLatestIncidentId', '@FindEntities'], { timeout: 30000 });

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

    cy.get('[data-cy="editors-input"] input').first().type('Test Editor{enter}');

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
      editors: ['Test Editor'],
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
          modifiedBy: 'Test User',
          reports: [],
        };

        expect(input).to.deep.eq(expectedIncident);
      });

    cy.get('.tw-toast')
      .contains(`You have successfully create Incident ${newIncidentId}. View incident`)
      .should('exist');
  });
});
