import { maybeIt } from '../../../support/utils';
import incident from '../../../fixtures/incidents/incident.json';
import updateOneIncident from '../../../fixtures/incidents/updateOneIncident.json';
import { getUnixTime } from 'date-fns';
import { deleteIncidentTypenames, transformIncidentData } from '../../../../src/utils/cite';
const { gql } = require('@apollo/client');

describe('Incidents', () => {
  const url = '/incidents/edit?incident_id=10';

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

  maybeIt('Should successfully edit incident fields', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncident',
      'FindIncident',
      incident
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

    cy.wait(['@FindIncident', '@FindEntities', '@FindUsers']);

    const values = {
      title: 'Test title',
      description: 'Test description',
      date: '2021-01-02',
      editor_notes: 'Test editor notes',
    };

    Object.keys(values).forEach((key) => {
      cy.get(`[name=${key}]`).clear().type(values[key]);
    });

    cy.get('[data-cy="alleged-deployer-of-ai-system-input"] input')
      .first()
      .type('Test Deployer{enter}');

    cy.get('#input-editors').type('Pablo');

    cy.get('[aria-label="Pablo Costa"]').click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateIncident',
      'UpdateIncident',
      updateOneIncident
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'logIncidentHistory',
      'logIncidentHistory',
      {
        data: {
          logIncidentHistory: {
            incident_id: 112,
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

    cy.wait('@UpsertDeployer')
      .its('request.body.variables.entity.entity_id')
      .should('eq', 'test-deployer');

    cy.wait('@UpsertChildren')
      .its('request.body.variables.entity.entity_id')
      .should('eq', 'children');

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

    cy.wait('@UpdateIncident').then((xhr) => {
      expect(xhr.request.body.operationName).to.eq('UpdateIncident');
      expect(xhr.request.body.variables.query.incident_id).to.eq(10);
      expect(xhr.request.body.variables.set).to.deep.eq(updatedIncident);
    });

    cy.wait('@logIncidentHistory', { timeout: 30000 })
      .its('request.body.variables.input')
      .then((input) => {
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

        expect(input).to.deep.eq(expectedIncident);
      });

    cy.get('.tw-toast').contains('Incident 10 updated successfully.').should('exist');
  });
});
