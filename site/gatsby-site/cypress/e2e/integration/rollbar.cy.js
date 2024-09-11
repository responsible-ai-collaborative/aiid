import { maybeIt } from '../../support/utils';

describe('Rollbar', () => {
  maybeIt('Should log an error to Rollbar', () => {
    cy.intercept('POST', 'https://api.rollbar.com/api/1/item/').as('rollbarAPICall');

    cy.visit('/login');

    cy.get('input[name=email]').type(Cypress.env('e2eUsername'));

    cy.get('input[name=password]').type('invalidPassword');

    cy.get('[data-cy="login-btn"]').click();

    cy.wait('@rollbarAPICall').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.statusMessage).to.equal('OK');
      expect(interception.response.body.err).to.equal(0);
    });
  });
});
