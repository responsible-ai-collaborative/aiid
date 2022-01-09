Cypress.Commands.add('disableSmoothScroll', () => {
  return cy.document().then((document) => {
    const node = document.createElement('style');

    node.innerHTML = 'html { scroll-behavior: auto !important;}';

    document.body.appendChild(node);
  });
});

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');

  cy.get('input[name=email]').type(email);

  cy.get('input[name=password]').type(password);

  return cy.get('form').submit();
});
