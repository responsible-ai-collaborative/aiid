describe('TSNE Visualization', () => {
  const url = '/summaries/spatial';

  it('Should render the TSNE visualization', () => {
    cy.visit(url);
    cy.get('[data-cy="tsne-visualization"] [data-cy="tsne-plotpoint"]').should('exist');
  });

  it('Should highlight source incident when one exists', () => {
    cy.visit(url + '?incident=1');
    cy.get('[data-cy="tsne-visualization"] [data-cy="tsne-plotpoint"].current')
      .should('exist')
      .should('be.visible');
  });

  it('Should show an incident card on hover', () => {
    cy.visit(url);
    cy.get('[data-cy="tsne-visualization"] #spatial-incident-1').trigger('mouseover');
    cy.get('[data-cy="tsne-visualization"] #spatial-incident-1 + [data-cy="incident-card"]').should(
      'be.visible'
    );
  });

  it('Incident card should show title', () => {
    cy.visit(url);
    cy.get('[data-cy="tsne-visualization"] #spatial-incident-1').trigger('mouseover');
    cy.get(
      '[data-cy="tsne-visualization"] #spatial-incident-1 + [data-cy="incident-card"] [data-cy="title"]'
    ).should('be.visible');
  });
});
