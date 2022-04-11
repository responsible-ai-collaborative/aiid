const runOnCI = process.env.CI ? it : it.skip;

describe('404 Page', () => {
  runOnCI('Successfully loads', () => {
    cy.visit('/something-that-does-not-exist', { failOnStatusCode: false });

    cy.title().should('eq', 'Page not found');
  });
});
