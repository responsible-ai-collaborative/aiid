import { maybeIt } from '../../../support/utils';
import taxa from '../../../fixtures/call/taxa.json';
import classifications from '../../../fixtures/call/classifications.json';

describe('Classifications App', () => {
  const url = '/apps/classifications';

  maybeIt('Successfully edit a CSET classification', () => {
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
  });
});
