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

  it('Should have OpenGraph meta tags', () => {
    const postSlug = 'incident-report-2022-july-august';

    const title = 'AI Incident Report for July and August 2022';

    const description =
      'This compilation of AI incidents published in July and August of 2022 highlights emerging incidents and provides a digest of recent additions to the database.';

    const imageUrl =
      'https://incidentdatabase.ai/static/99f8b794fdc0da79022b7f6e38025aca/011c1/aiid-july-august.png';

    cy.visit(`/blog/${postSlug}`);

    cy.title().should('eq', title);

    cy.get('head meta[name="title"]').should('have.attr', 'content', title);
    cy.get('head meta[name="description"]').should('have.attr', 'content', description);

    cy.get('head meta[name="twitter:site"]').should('have.attr', 'content', '@IncidentsDB');
    cy.get('head meta[name="twitter:creator"]').should('have.attr', 'content', '@IncidentsDB');

    cy.get('head meta[property="og:url"]').should(
      'have.attr',
      'content',
      `https://incidentdatabase.ai/blog/${postSlug}/`
    );
    cy.get('head meta[property="og:type"]').should('have.attr', 'content', 'website');
    cy.get('head meta[property="og:title"]').should('have.attr', 'content', title);
    cy.get('head meta[property="og:description"]').should('have.attr', 'content', description);
    cy.get('head meta[property="og:image"]').should('have.attr', 'content', imageUrl);
    cy.get('head meta[property="twitter:title"]').should('have.attr', 'content', title);
    cy.get('head meta[property="twitter:description"]').should('have.attr', 'content', description);
    cy.get('head meta[property="twitter:image"]').should('have.attr', 'content', imageUrl);
  });
});
