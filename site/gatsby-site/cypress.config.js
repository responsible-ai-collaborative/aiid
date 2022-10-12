const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: true,
  videoUploadOnPasses: false,
  chromeWebSecurity: false,
  defaultCommandTimeout: 30000,
  screenshotOnRunFailure: false,
  requestTimeout: 30000,
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
    baseUrl: process.env.NETLIFY != 'true' ? 'http://localhost:8000' : undefined,
  },
});
