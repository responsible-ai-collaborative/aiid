const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: true,
  videoUploadOnPasses: false,
  chromeWebSecurity: false,
  defaultCommandTimeout: 60000,
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
    baseUrl: 'http://localhost:9000/',
  },
});
