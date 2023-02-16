describe('Translation Badges', () => {
  it('Should be visible on blog post', () => {
    cy.visit('/es/blog/using-ai-to-connect-ai-incidents');

    cy.contains('[data-cy="translation-badge"]', 'Traducido por IA').should('be.visible');

    cy.contains('a', 'Ver Original')
      .should('be.visible')
      .should('have.attr', 'href')
      .and('eq', '/blog/using-ai-to-connect-ai-incidents/');
  });

  it('Should be visible on the discover app', () => {
    cy.visit('/es/apps/discover?display=details&incident_id=1&page=1&source_domain=today.com');

    cy.get('[data-cy="5d34b8c29ced494f010ed45c"]')
      .contains('[data-cy="translation-badge"]', 'Traducido por IA')
      .should('be.visible');
  });

  it('Should be visible on an incident card on the citation page', () => {
    cy.visit('/es/cite/1#r1');

    cy.get('#r1')
      .contains('[data-cy="translation-badge"]', 'Traducido por IA')
      .should('be.visible');
  });

  it('Should be visible on documentation pages', () => {
    cy.visit('/es/about_apps');

    cy.contains('[data-cy="translation-badge"]', 'Traducido por IA').should('be.visible');

    cy.contains('a', 'Ver Original')
      .should('be.visible')
      .should('have.attr', 'href')
      .and('eq', '/about_apps/');
  });
});
