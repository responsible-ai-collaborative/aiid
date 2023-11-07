import { getApolloClient } from './utils';
import { registerCommand } from 'cypress-wait-for-stable-dom';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';

chai.use(deepEqualInAnyOrder);

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

  return cy.location('pathname', { timeout: 8000 }).should('not.equal', '/login/');
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

Cypress.Commands.add('query', ({ query, variables, timeout = 30000 }) => {
  const client = getApolloClient();

  return cy.wrap(client.query({ query, variables }), { log: true, timeout });
});

Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click(0, 0);
});

Cypress.Commands.add('setEditorText', (value, selector = '.CodeMirror') => {
  return cy
    .get(selector)
    .first()
    .click()
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

Cypress.Commands.add('setDate', (value, fieldName) => {
  const parts = value.split('-');

  // Extract the year, month, and day from the date value
  const year = parts[0];

  const month = parseInt(parts[1]) - 1;

  const day = parseInt(parts[2]).toString(); // remove leading zero

  return cy
    .get(`.rdt.datetime-${fieldName} input`)
    .first()
    .click()
    .then(() => {
      cy.get(`.rdt.datetime-${fieldName}.rdtOpen .rdtPicker .rdtSwitch`).first().click(); //Switch to month
      cy.get(`.rdt.datetime-${fieldName}.rdtOpen .rdtPicker .rdtSwitch`).first().click(); //Switch to year

      const selectYear = (year) => {
        cy.get(`.rdt.datetime-${fieldName}.rdtOpen .rdtPicker`).then(($years) => {
          if ($years.text().includes(year)) {
            cy.get(`.rdt.datetime-${fieldName}.rdtOpen .rdtYear`).contains(year).click();
          } else {
            // Click the next year range button
            cy.get(`.rdt.datetime-${fieldName}.rdtOpen .rdtNext`).click();
            // Call the function recursively
            selectYear(year);
          }
        });
      };

      selectYear(year);

      cy.waitForStableDOM();
      cy.get(
        `.rdt.datetime-${fieldName}.rdtOpen .rdtPicker .rdtMonths .rdtMonth[data-value="${month}"]`
      )
        .first()
        .click();

      cy.waitForStableDOM();
      cy.get(`.rdt.datetime-${fieldName}.rdtOpen .rdtPicker .rdtDays .rdtDay[data-value="${day}"]`)
        .first()
        .click({ force: true });
    });
});
