describe('404 Page', () => {
  it('Successfully loads', () => {
    cy.get('html')
      .then(($html) => {
        return $html.find('meta[content="environment=development"]').length === 0;
      })
      .then(() => {
        cy.visit('/something-that-does-not-exist', { failOnStatusCode: false });

        cy.title().should('eq', 'Page not found');
      });
  });
});
