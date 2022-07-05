import { maybeIt } from '../../support/utils';

import incident from '../../fixtures/incidents/incident112.json';

import updateOneIncident from '../../fixtures/incidents/updateOneIncident112.json';

import incidents from '../../fixtures/incidents/incidents.json';

describe('Incidents App', () => {
  const url = '/apps/incidents';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should display a list of incidents and their values', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidents',
      'FindIncidents',
      incidents
    );

    cy.visit(url);

    cy.get('[data-cy="row"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="cell"]').should('have.length', 7);

        const { 0: incident } = incidents.data.incidents;

        cy.get('[data-cy="cell"]').eq(0).should('have.text', `Incident ${incident.incident_id}`);
        cy.get('[data-cy="cell"]').eq(1).should('have.text', incident.title);
        cy.get('[data-cy="cell"]').eq(2).should('have.text', incident.description);
        cy.get('[data-cy="cell"]').eq(3).should('have.text', incident.date);
        cy.get('[data-cy="cell"]')
          .eq(4)
          .should('have.text', incident.AllegedDeployerOfAISystem.join(', '));
        cy.get('[data-cy="cell"]')
          .eq(5)
          .should('have.text', incident.AllegedDeveloperOfAISystem.join(', '));
        cy.get('[data-cy="cell"]')
          .eq(6)
          .should('have.text', incident.AllegedHarmedOrNearlyHarmedParties.join(', '));
      });
  });

  maybeIt('Successfully filter and edit incident 11', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.get('[data-cy="input-filter-Incident ID"]').type('112');

    cy.clickOutside();

    cy.get('[data-cy="row"]').should('have.length', 1);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncident',
      'FindIncident',
      incident
    );

    cy.contains('Edit').click();

    cy.wait('@FindIncident').then((xhr) => {
      expect(xhr.request.body.operationName).to.eq('FindIncident');
      expect(xhr.request.body.variables.query.incident_id).to.eq(112);
    });

    cy.get('[data-cy="incident-form"]').should('exist').as('form');

    cy.get(`[name="title"]`).clear().type('Test title');

    cy.get('[data-cy="similar-id-input"]').type('40');

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'IncidentWithReports',
      'IncidentWithReports'
    );

    cy.wait('@IncidentWithReports');

    cy.get('[data-cy="related-byId"] [data-cy="similar"]').first().click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateIncident',
      'UpdateIncident',
      updateOneIncident
    );

    cy.contains('Update').click();

    cy.wait('@UpdateIncident').then((xhr) => {
      expect(xhr.request.body.operationName).to.eq('UpdateIncident');
      expect(xhr.request.body.variables.query.incident_id).to.eq(112);
      expect(xhr.request.body.variables.set.title).to.eq('Test title');
      expect(xhr.request.body.variables.set.editor_similar_incidents).to.contain(40);
    });

    cy.get('[data-cy="incident-form"]').should('not.exist');

    cy.get('[data-cy="toast"]').contains('Incident 112 updated successfully.').should('exist');
  });
});
