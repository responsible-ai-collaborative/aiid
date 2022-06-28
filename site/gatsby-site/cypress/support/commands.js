import { getApolloClient } from './utils';

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

  return cy.location('pathname', { timeout: 8000 }).should('eq', '/');
});

Cypress.Commands.add(
  'conditionalIntercept',
  (url, condition, alias, response = null, options = { method: '*' }) => {
    cy.intercept(url, options, (req) => {
      if (condition(req)) {
        req.alias = alias;

        if (response) {
          req.reply(response);
        }
      }
    });
  }
);

Cypress.Commands.add('query', ({ query, variables }) => {
  const client = getApolloClient();

  return cy.wrap(client.query({ query, variables }), { timeout: 8000, log: true });
});

Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click(0, 0);
});

Cypress.Commands.add('setEditorText', (value) => {
  return cy
    .get('.CodeMirror')
    .first()
    .then((editor) => {
      editor[0].CodeMirror.setValue(value);
    });
});

Cypress.Commands.add('getEditorText', () => {
  return cy
    .get('.CodeMirror')
    .first()
    .then(({ 0: editor }) => {
      return editor.CodeMirror.options.value;
    });
});
