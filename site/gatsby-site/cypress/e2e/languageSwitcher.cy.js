describe('The Language switcher', () => {
  it('Should be hidden if the localStorage key is not set', () => {
    cy.visit('/');

    cy.get('[data-cy="language-switcher"]').should('not.exist');
  });

  it('Language should default to English', () => {
    cy.visit('/');

    cy.contains('h1', 'Welcome to the Artificial Intelligence Incident Database').should(
      'be.visible'
    );
  });

  it('Should be visible if the localStorage key is set', () => {
    cy.window().then((window) => window.localStorage.setItem('i18n', '1'));

    cy.visit('/');

    cy.get('[data-cy="language-switcher"]').should('exist');
  });

  it('Should update the path with the selected language', () => {
    cy.window().then((window) => window.localStorage.setItem('i18n', '1'));

    cy.visit('/');

    cy.get('[data-cy="language-switcher"]').click();

    cy.get('[data-cy="language-switcher"]').contains('[role="button"]', 'Spanish').click();

    cy.url().should('contain', '/es/');

    cy.contains(
      'h1',
      'Bienvenido a la base de datos de incidentes de Inteligencia Artificial'
    ).should('be.visible');
  });
});
