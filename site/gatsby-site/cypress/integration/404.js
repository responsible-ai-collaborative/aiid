describe('404 Page', () => {
  it('Successfully loads', () => {
    cy.visit('/something-that-does-not-exist', { failOnStatusCode: false });

    cy.title().should('eq', 'Page not found');
  });
});
