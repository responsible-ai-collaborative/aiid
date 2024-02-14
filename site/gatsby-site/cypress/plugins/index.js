/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

require('dotenv').config();

const fs = require('fs');

const path = require('path');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('task', {
    listFiles(directoryPath) {
      return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
          if (err) {
            reject(err);
          } else {
            const jsonFiles = files.filter((file) => {
              return (
                path.extname(file).toLowerCase() === '.json' &&
                fs.statSync(path.join(directoryPath, file)).isFile()
              );
            });

            resolve(jsonFiles);
          }
        });
      });
    },
  });

  config.env.e2eUsername = process.env.E2E_ADMIN_USERNAME;
  config.env.e2ePassword = process.env.E2E_ADMIN_PASSWORD;
  config.env.realmAppId = process.env.GATSBY_REALM_APP_ID;
  config.env.isEmptyEnvironment = process.env.IS_EMPTY_ENVIRONMENT == 'true';
  config.env.availableLanguages = process.env.GATSBY_AVAILABLE_LANGUAGES;

  return config;
};
