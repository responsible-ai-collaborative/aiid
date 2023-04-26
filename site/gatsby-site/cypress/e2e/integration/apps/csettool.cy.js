import { maybeIt } from '../../../support/utils';
import cssettool from '../../../fixtures/classifications/cssettool.json';

describe('CSET tool', () => {
  const url = '/apps/csettool/52/';

  maybeIt('Successfully loads CSET annotator classifications', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindClassifications',
      'FindClassifications',
      cssettool
    );

    cy.visit(url);

    cy.wait(['@FindClassifications']);

    cy.waitForStableDOM();

    cy.get('tbody > tr').should('have.length', 62);
    cy.get('thead th').should('have.length', 3);
  });
});
