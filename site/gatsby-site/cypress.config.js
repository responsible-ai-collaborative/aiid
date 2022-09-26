const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: false,
  videoUploadOnPasses: false,
  chromeWebSecurity: false,
  defaultCommandTimeout: 15000,
  screenshotOnRunFailure: false,
  requestTimeout: 15000,
  retries: {
    runMode: 4,
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
