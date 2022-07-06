// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

const ignoredErrors = [
  // disable Realm error when origin is not whitelisted
  'origin forbidden (status 403 Forbidden)',

  // I have no Idea why this is happening, but it is.
  'Transport not open',

  // flakiness, flakiness everywhere: https://github.com/cypress-io/cypress/issues/8418
  'ResizeObserver loop limit exceeded',
];

Cypress.on('uncaught:exception', (err) => {
  if (ignoredErrors.some((e) => err.message.includes(e))) {
    return false;
  }
});
