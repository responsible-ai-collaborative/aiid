describe('Report pages', () => {
  const reportNumber = 2302;

  const url = `/reports/${reportNumber}`;

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should always be expanded', () => {
    cy.visit(url);

    cy.get('[data-cy="incident-report-card"]').should('have.class', 'expanded');
  });
});
