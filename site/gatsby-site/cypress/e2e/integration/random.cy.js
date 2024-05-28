describe('Random', () => {
  const url = '/random';

  it('Should navigate to random page', () => {
    cy.visit(url);
    cy.waitForStableDOM();
    cy.location('pathname').should('to.match', new RegExp('/cite/\\d+/'));
  });
});
