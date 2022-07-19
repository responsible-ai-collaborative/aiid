const { defineConfig } = require('cypress');

const projectId = process.env.CYPRESS_PROJECT_ID;

module.exports = defineConfig({
  projectId,
  video: false,
  chromeWebSecurity: false,
  defaultCommandTimeout: 30000,
  requestTimeout: 15000,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:8000/',
  },
});
