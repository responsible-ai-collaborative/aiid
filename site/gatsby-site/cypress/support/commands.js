import { getApolloClient } from './utils';
import { registerCommand } from 'cypress-wait-for-stable-dom';

registerCommand();

Cypress.Commands.add('disableSmoothScroll', () => {
  return cy.document().then((document) => {
    const node = document.createElement('style');

    node.innerHTML = 'html { scroll-behavior: auto !important;}';

    document.body.appendChild(node);
  });
});

const loginSteps = (email, password) => {
  cy.visit('/login');

  cy.get('input[name=email]').type(email);

  cy.get('input[name=password]').type(password);

  cy.get('[data-cy="login-btn"]').click();

  return cy.location('pathname', { timeout: 8000 }).should('eq', '/');
};

Cypress.Commands.add('login', (email, password, options = { skipSession: false }) => {
  if (options.skipSession) {
    return loginSteps(email, password);
  } else {
    cy.session([email, password], () => {
      loginSteps(email, password);
    });
  }
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

  return cy.wrap(client.query({ query, variables }), { log: true, timeout: 30000 });
});

Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click(0, 0);
});

Cypress.Commands.add('setEditorText', (value, selector = '.CodeMirror') => {
  return cy
    .get(selector)
    .first()
    .then((editor) => {
      editor[0].CodeMirror.setValue(value);
    });
});

Cypress.Commands.add('getEditorText', (selector = '.CodeMirror') => {
  return cy
    .get(selector)
    .first()
    .then(({ 0: editor }) => {
      return editor.CodeMirror.options.value;
    });
});
