describe('Blog', () => {
  it('Should include outline in blog post', () => {
    cy.visit('/blog/the-first-taxonomy-of-ai-incidents');

    cy.get('[data-cy="outline"] > li').should('have.length.at.least', 5);

    cy.get('[data-cy="outline"]').contains('Multiple Perspectives').should('exist');
    cy.get('[data-cy="outline"]').contains('Collection Biases').should('exist');
    cy.get('[data-cy="outline"]').contains('What Can You Do With This?').should('exist');
    cy.get('[data-cy="outline"]').contains('Credit and Acknowledgements').should('exist');
  });

  it('Should include outline in Spanish blog post', () => {
    cy.visit('/es/blog/multilingual-incident-reporting');

    cy.get('[data-cy="outline"] > li').should('have.length.at.least', 3);

    cy.get('[data-cy="outline"]').contains('¿Como funciona?').should('exist');
    cy.get('[data-cy="outline"]').contains('Llamado a la acción').should('exist');
    cy.get('[data-cy="outline"]').contains('Anexo: Riesgos y mejores prácticas').should('exist');
  });
});
