describe('Reports App', () => {
  const url = '/apps/incidents';

  it('Successfully loads reports', () => {
    cy.visit(url + '?view=reports');
  });

  it('Successfully loads issue reports', () => {
    cy.visit(url + '?view=issueReports');
  });

  it('Filters a report by title ', () => {
    cy.visit(url + '?view=reports');

    cy.get('[data-cy="filter"]', { timeout: 15000 })
      .eq(1)
      .find('input')
      .type('YouTube Kids has been a problem since 2015 - why did it take this long to address?');

    cy.get('[data-cy="row').should('have.length', 1);
  });
});
