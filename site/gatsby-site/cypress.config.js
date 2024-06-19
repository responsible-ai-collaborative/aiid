const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: false,
  chromeWebSecurity: false,
  screenshotOnRunFailure: false,
  defaultCommandTimeout: 12000,
  requestTimeout: 30000,
  responseTimeout: 30000,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    experimentalRunAllSpecs: true,
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      if (process.env.INSTRUMENT) {
        require('@cypress/code-coverage/task')(on, config);
      }

      require('./cypress/plugins/index.js')(on, config);

      return config;
    },
    baseUrl: 'http://localhost:8000/',
  },
});
