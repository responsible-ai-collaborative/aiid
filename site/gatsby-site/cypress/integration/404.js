describe('404 Page', () => {
  it('Successfully loads', () => {
    cy.visit('/');

    cy.get('html').then(($html) => {
      if ($html.find('meta[content="environment=development"]').length === 0) {
        cy.visit('/something-that-does-not-exist', { failOnStatusCode: false });

        cy.title().should('eq', 'Page not found');
      }
    });
  });
});
