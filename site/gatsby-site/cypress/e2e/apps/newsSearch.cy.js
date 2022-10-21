describe('Incidents App', () => {
  const url = '/apps/newsSearch';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should loads candidate cards', () => {
    cy.visit(url);
    cy.get('[data-cy="candidate-card"]').should('exist');
  });

  it('Should open submit form on pressing submit', () => {
    cy.visit(url);
    cy.get('[data-cy="candidate-card"] [data-cy="submit-button"]').first().click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal('/apps/submit/');
    });
  });

  it('Should dismiss and restore items', () => {
    cy.visit(url);

    cy.get('[data-cy="results"] [data-cy="candidate-card"]')
      .first()
      .invoke('attr', 'data-id')
      .then((dataId) => {
        cy.get(`[data-id="${dataId}"] [data-cy="dismiss-button"]`).click();

        cy.get(`[data-cy="dismissed"] [data-id="${dataId}"]`).should('exist');

        cy.get(`[data-cy="results"] [data-id="${dataId}"]`).should('not.exist');

        cy.get(`[data-cy="dismissed-summary"]`).click();

        cy.get(`[data-cy="dismissed"] [data-id="${dataId}"] [data-cy="restore-button"]`).click();

        cy.get(`[data-cy="results"] [data-id="${dataId}"]`).should('exist');

        cy.get(`[data-cy="dismissed"] [data-id="${dataId}"]`).should('not.exist');
      });
  });
});
