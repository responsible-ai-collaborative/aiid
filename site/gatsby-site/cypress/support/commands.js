Cypress.Commands.add('disableSmoothScroll', () => {
  return cy.document().then((document) => {
    const node = document.createElement('style');

    node.innerHTML = 'html { scroll-behavior: auto !important;}';

    document.body.appendChild(node);
  });
});

Cypress.Commands.add('login', (email, password) => {
  cy.clearLocalStorage();

  cy.visit('/login');

  cy.get('input[name=email]').type(email);

  cy.get('input[name=password]').type(password);

  cy.contains('Login').click();

  return cy.location('pathname').should('eq', '/');
});
