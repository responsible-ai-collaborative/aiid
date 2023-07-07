describe('Report pages', () => {
  const reportNumber = 2302;

  const url = `/reports/${reportNumber}`;

  let pageExists = false;

  beforeEach(() => {
    cy.request({
      url,
      failOnStatusCode: false,
    }).then((response) => {
      pageExists = response.status !== 404;
    });
  });

  it('Successfully loads', () => {
    if (pageExists) {
      cy.visit(url);
    }
  });

  it('Should always be expanded', () => {
    if (pageExists) {
      cy.visit(url);

      cy.get('[data-cy="incident-report-card"]').should('have.class', 'expanded');
    }
  });
});
