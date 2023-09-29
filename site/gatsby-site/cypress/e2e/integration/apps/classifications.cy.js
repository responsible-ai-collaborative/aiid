import { conditionalIt } from '../../../support/utils';
import taxa from '../../../fixtures/call/taxa.json';
import classifications from '../../../fixtures/call/classifications.json';

describe('Classifications App', () => {
  const url = '/apps/classifications';

  it('Should successfully load', () => {
    cy.visit(url);
  });

  it('Should successfully load the table', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindTaxa',
      'FindTaxa',
      taxa
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindClassifications',
      'FindClassifications',
      classifications
    );

    cy.visit(url);

    cy.wait(['@FindTaxa', '@FindClassifications']);

    cy.waitForStableDOM();

    cy.get('[data-cy="row"]').should('have.length', 2);
  });

  conditionalIt(
    !Cypress.env('isEmptyEnvironment'),
    'Successfully edit a CSET classification',
    () => {
      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'FindTaxa',
        'FindTaxa',
        taxa
      );

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'FindClassifications',
        'FindClassifications',
        classifications
      );

      cy.visit(url);

      cy.wait(['@FindTaxa', '@FindClassifications']);

      cy.get('select[data-cy="taxonomy"]').select('CSET');

      cy.waitForStableDOM();

      cy.get('a[href="/cite/2/?edit_taxonomy=CSET').click();
    }
  );

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Should switch taxonomies', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindTaxa',
      'FindTaxa',
      taxa
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindClassifications',
      'FindClassifications',
      classifications
    );

    cy.visit(url);

    cy.wait(['@FindTaxa', '@FindClassifications']);

    cy.get('select[data-cy="taxonomy"]').select('CSET');

    cy.waitForStableDOM();

    cy.get('select[data-cy="taxonomy"]').select('GMF');

    cy.waitForStableDOM();

    cy.get('[role="columnheader"]').contains('Known AI Goal').should('exist');
  });
});
