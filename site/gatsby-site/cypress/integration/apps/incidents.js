import { maybeIt } from '../../support/utils';

import incident from '../../fixtures/incidents/incident112.json';

import updateOneIncident from '../../fixtures/incidents/updateOneIncident112.json';

describe('Classifications App', () => {
  const url = '/apps/incidents';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  maybeIt('Successfully filter and edit incident 11', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.get('[data-cy="filter-Incident ID"]').click();

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

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateIncident',
      'UpdateIncident',
      updateOneIncident
    );

    cy.contains('Save').click();

    cy.wait('@UpdateIncident').then((xhr) => {
      expect(xhr.request.body.operationName).to.eq('UpdateIncident');
      expect(xhr.request.body.variables.query.incident_id).to.eq(112);
      expect(xhr.request.body.variables.set.title).to.eq('Test title');
    });

    cy.contains('Close').click();
  });
});
