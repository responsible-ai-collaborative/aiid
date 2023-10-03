describe('Report pages', () => {
  const url = `/reports/`;

  const reportWithIncidents = 1;

  const reportNoIncidents = 2302;

  it('Successfully loads', () => {
    cy.visit(url + reportWithIncidents);
  });

  it('Should Display associated Incidents', () => {
    cy.visit(url + reportWithIncidents);

    cy.contains('Associated Incidents').should('be.visible');

    cy.contains('Google’s YouTube Kids App Presents Inappropriate Content')
      .should('be.visible')
      .should('have.attr', 'href', '/cite/1/');

    cy.get('[data-cy="incident-report-card"]').should('have.length', 1);
  });

  it('Should not display associated Incidents', () => {
    cy.visit(url + reportNoIncidents);

    cy.contains('Associated Incidents').should('not.exist');
  });

  it('Should always be expanded', () => {
    cy.visit(url + reportWithIncidents);

    cy.get('[data-cy="incident-report-card"]').should('have.class', 'expanded');
  });
});
