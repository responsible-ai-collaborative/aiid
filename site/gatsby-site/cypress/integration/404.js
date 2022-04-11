describe('404 Page', () => {
  it('Successfully loads', () => {
    cy.visit('/something-that-does-not-exist');

    cy.title().should('eq', 'Page not found');
  });
});
