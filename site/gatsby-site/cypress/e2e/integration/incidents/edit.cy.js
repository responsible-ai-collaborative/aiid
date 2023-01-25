import { maybeIt } from '../../../support/utils';

import incident from '../../../fixtures/incidents/incident.json';

import updateOneIncident from '../../../fixtures/incidents/updateOneIncident.json';

describe('Incidents', () => {
  const url = '/incidents/edit?incident_id=10';

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

    cy.wait(['@FindIncident', '@FindEntities']);

    const values = {
      title: 'Test title',
      description: 'Test description',
      date: '2021-01-02',
    };

    Object.keys(values).forEach((key) => {
      cy.get(`[name=${key}]`).clear().type(values[key]);
    });

    cy.contains('label', 'Alleged Deployer of AI System')
      .next()
      .find('[type="text"]')
      .type('Test Deployer{enter}');

    cy.contains('label', 'Editors').next().find('[type="text"]').type('Test Editor{enter}');

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateIncident',
      'UpdateIncident',
      updateOneIncident
    );

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

    cy.wait('@UpdateIncident').then((xhr) => {
      expect(xhr.request.body.operationName).to.eq('UpdateIncident');
      expect(xhr.request.body.variables.query.incident_id).to.eq(10);
      expect(xhr.request.body.variables.set.title).to.eq('Test title');
      expect(xhr.request.body.variables.set.description).to.eq('Test description');
      expect(xhr.request.body.variables.set.date).to.eq('2021-01-02');
      expect(xhr.request.body.variables.set.AllegedDeployerOfAISystem.link).to.deep.eq([
        'youtube',
        'test-deployer',
      ]);
      expect(xhr.request.body.variables.set.AllegedDeveloperOfAISystem.link).to.deep.eq([
        'youtube',
      ]);
      expect(xhr.request.body.variables.set.AllegedHarmedOrNearlyHarmedParties.link).to.deep.eq([
        'children',
      ]);
      expect(xhr.request.body.variables.set.editors).to.deep.eq(['Sean McGregor', 'Test Editor']);
    });

    cy.get('div[class^="ToastContext"]')
      .contains('Incident 10 updated successfully.')
      .should('exist');
  });
});
