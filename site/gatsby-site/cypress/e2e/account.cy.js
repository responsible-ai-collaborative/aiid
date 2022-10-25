describe('Account', () => {
  const url = '/account';

  it('Should successfully load account page', () => {
    cy.visit(url);
  });

  it('Should display account information if the user is logged in', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.contains(Cypress.env('e2eUsername')).should('exist');

    cy.contains('Log out').should('exist');
  });
});
