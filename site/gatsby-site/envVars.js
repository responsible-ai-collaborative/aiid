const requiredEnvVars = {
  E2E_ADMIN_PASSWORD: process.env.E2E_ADMIN_PASSWORD || '',
  E2E_ADMIN_USERNAME: process.env.E2E_ADMIN_USERNAME || '',
  REALM_API_APP_ID: process.env.REALM_API_APP_ID || '',
  REALM_API_GROUP_ID: process.env.REALM_API_GROUP_ID || '',
  REALM_API_PRIVATE_KEY: process.env.REALM_API_PRIVATE_KEY || '',
  REALM_API_PUBLIC_KEY: process.env.REALM_API_PUBLIC_KEY || '',
  REALM_GRAPHQL_API_KEY: process.env.REALM_GRAPHQL_API_KEY || '',
  REALM_APP_ID: process.env.REALM_APP_ID || '',
  API_MONGODB_CONNECTION_STRING: process.env.API_MONGODB_CONNECTION_STRING || '',
  ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN: process.env.ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN || '',
};

const optionalEnvVars = {
  IS_EMPTY_ENVIRONMENT: process.env.IS_EMPTY_ENVIRONMENT || '',
  AVAILABLE_LANGUAGES: process.env.GATSBY_AVAILABLE_LANGUAGES || '',
};

Object.keys(requiredEnvVars).forEach((key) => {
  if (requiredEnvVars[key] === undefined || requiredEnvVars[key] === '') {
    throw new Error(`Required environment variable "${key}" is undefined or empty`);
  }
});

const envVars = { ...requiredEnvVars, ...optionalEnvVars };

module.exports = envVars;
