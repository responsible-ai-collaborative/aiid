describe('Report pages', () => {
  const reportNumber = 2302;

  const url = `/reports/${reportNumber}`;

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should Display associated Incidents', () => {
    cy.visit(`/reports/1`);

    cy.contains('Associated Incidents').should('be.visible');

    cy.contains('Google’s YouTube Kids App Presents Inappropriate Content')
      .should('be.visible')
      .should('have.attr', 'href', '/cite/1/');

    cy.get('[data-cy="incident-report-card"]').should('have.length', 1);
  });

  it('Should not display associated Incidents', () => {
    cy.visit(`/reports/2974/`);

    cy.contains('Associated Incidents').should('not.exist');
  });

  it('Should always be expanded', () => {
    cy.visit(url);

    cy.get('[data-cy="incident-report-card"]').should('have.class', 'expanded');
  });
});
