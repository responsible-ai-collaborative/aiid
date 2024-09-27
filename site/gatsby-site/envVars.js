// Server environment variables
const requiredServerEnvVars = {
  REALM_API_APP_ID: process.env.REALM_API_APP_ID,
  REALM_API_GROUP_ID: process.env.REALM_API_GROUP_ID,
  REALM_API_PRIVATE_KEY: process.env.REALM_API_PRIVATE_KEY,
  REALM_API_PUBLIC_KEY: process.env.REALM_API_PUBLIC_KEY,
  REALM_GRAPHQL_API_KEY: process.env.REALM_GRAPHQL_API_KEY,
  REALM_APP_ID: process.env.REALM_APP_ID,
  API_MONGODB_CONNECTION_STRING: process.env.API_MONGODB_CONNECTION_STRING || '',
  ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN: process.env.ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN,
};

const optionalServerEnvVars = {};

const checkServerEnvVars = () => {
  Object.keys(requiredServerEnvVars).forEach((key) => {
    if (requiredServerEnvVars[key] === undefined || requiredServerEnvVars[key] === '') {
      throw new Error(`Required Server environment variable "${key}" is undefined`);
    }
  });
};

// Cypress environment variables
const requiredCypressEnvVars = {
  E2E_ADMIN_PASSWORD: process.env.E2E_ADMIN_PASSWORD || '',
  E2E_ADMIN_USERNAME: process.env.E2E_ADMIN_USERNAME || '',
};

const optionalCypressEnvVars = {
  IS_EMPTY_ENVIRONMENT: process.env.IS_EMPTY_ENVIRONMENT ?? '',
  AVAILABLE_LANGUAGES: process.env.GATSBY_AVAILABLE_LANGUAGES ?? '',
};

const checkCypressEnvVars = () => {
  Object.keys(requiredCypressEnvVars).forEach((key) => {
    if (requiredCypressEnvVars[key] === undefined || requiredCypressEnvVars[key] === '') {
      throw new Error(`Required Cypress environment variable "${key}" is undefined or empty`);
    }
  });
};

const envVars = {
  ...requiredServerEnvVars,
  ...optionalServerEnvVars,
  ...requiredCypressEnvVars,
  ...optionalCypressEnvVars,
};

module.exports = {
  envVars,
  checkServerEnvVars,
  checkCypressEnvVars,
};
