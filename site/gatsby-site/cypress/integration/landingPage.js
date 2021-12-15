describe('The Landing page', () => {
  it('successfully loads', () => {
    cy.visit('/');
  });

  it('Sends a search to the Discover app', () => {
    cy.visit('/');
    cy.get('form#quickSearch input[placeholder="Search all incident reports"]').type('Test');
    cy.get('form#quickSearch').submit();

    cy.url().should('include', '/apps/discover');
    cy.url().should('include', 's=Test');
  });
});
