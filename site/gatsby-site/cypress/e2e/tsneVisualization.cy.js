describe('TSNE Visualization', () => {
  const url = '/summaries/spatial';

  it('Should render the TSNE visualization', () => {
    cy.visit(url);
    cy.get('[data-cy="tsne-visualization"] [data-cy="tsne-plotpoint"]').should('exist');
  });
});
