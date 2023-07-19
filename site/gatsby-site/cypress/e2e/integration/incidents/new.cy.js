import { maybeIt } from '../../../support/utils';

import incidents from '../../../fixtures/incidents/incidents.json';

import updateOneIncident from '../../../fixtures/incidents/updateOneIncident.json';

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

    cy.wait(['@GetLatestIncidentId', '@FindEntities', '@FindUsers'], { timeout: 30000 });

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
      updateOneIncident
    );

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

    cy.wait('@InsertIncident').then((xhr) => {
      expect(xhr.request.body.operationName).to.eq('InsertIncident');
      expect(xhr.request.body.variables.incident.incident_id).to.eq(newIncidentId);
      expect(xhr.request.body.variables.incident.title).to.eq('Test title');
      expect(xhr.request.body.variables.incident.description).to.eq('Test description');
      expect(xhr.request.body.variables.incident.date).to.eq('2021-01-02');
      expect(xhr.request.body.variables.incident.editor_similar_incidents).to.deep.eq([]);
      expect(xhr.request.body.variables.incident.editor_dissimilar_incidents).to.deep.eq([]);

      expect(xhr.request.body.variables.incident.AllegedDeployerOfAISystem.link).to.deep.eq([
        'test-deployer',
      ]);
      expect(xhr.request.body.variables.incident.AllegedDeveloperOfAISystem.link).to.deep.eq([
        'youtube',
      ]);
      expect(
        xhr.request.body.variables.incident.AllegedHarmedOrNearlyHarmedParties.link
      ).to.deep.eq(['children']);
      expect(xhr.request.body.variables.incident.editors).to.deep.eq(['2']);
    });

    cy.get('.tw-toast')
      .contains(`You have successfully create Incident ${newIncidentId}. View incident`)
      .should('exist');
  });
});
