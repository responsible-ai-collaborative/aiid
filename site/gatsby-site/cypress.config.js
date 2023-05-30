const { defineConfig } = require('cypress');

require('dotenv').config();

const config = require('./config');

module.exports = defineConfig({
  projectId: config.cypress.projectId,
  video: false,
  videoUploadOnPasses: false,
  chromeWebSecurity: false,
  screenshotOnRunFailure: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    experimentalRunAllSpecs: true,
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:8000/',
  },
});
