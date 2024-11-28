// Server environment variables
const requiredServerEnvVars = {
  REALM_API_APP_ID: String(process.env.REALM_API_APP_ID),
  REALM_API_GROUP_ID: String(process.env.REALM_API_GROUP_ID),
  REALM_API_PRIVATE_KEY: String(process.env.REALM_API_PRIVATE_KEY),
  REALM_API_PUBLIC_KEY: String(process.env.REALM_API_PUBLIC_KEY),
  REALM_GRAPHQL_API_KEY: String(process.env.REALM_GRAPHQL_API_KEY),
  REALM_APP_ID: String(process.env.REALM_APP_ID),
  API_MONGODB_CONNECTION_STRING: String(process.env.API_MONGODB_CONNECTION_STRING),
  ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN: String(process.env.ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN),
};

const optionalServerEnvVars = {
  MAILERSEND_API_KEY: String(process.env.MAILERSEND_API_KEY ?? ''),
  NOTIFICATIONS_SENDER_NAME: String(process.env.NOTIFICATIONS_SENDER_NAME ?? ''),
  NOTIFICATIONS_SENDER: String(process.env.NOTIFICATIONS_SENDER ?? ''),
  SITE_URL: String(process.env.SITE_URL ?? ''),
};

const checkServerEnvVars = () => {
  Object.keys(requiredServerEnvVars).forEach((key) => {
    if (requiredServerEnvVars[key] === 'undefined') {
      throw new Error(`Required Server environment variable "${key}" is undefined`);
    }
  });
};

// Cypress environment variables
const requiredCypressEnvVars = {
  E2E_ADMIN_PASSWORD: String(process.env.E2E_ADMIN_PASSWORD),
  E2E_ADMIN_USERNAME: String(process.env.E2E_ADMIN_USERNAME),
};

const optionalCypressEnvVars = {
  IS_EMPTY_ENVIRONMENT: String(process.env.IS_EMPTY_ENVIRONMENT ?? ''),
  AVAILABLE_LANGUAGES: String(process.env.GATSBY_AVAILABLE_LANGUAGES ?? ''),
};

const checkCypressEnvVars = () => {
  Object.keys(requiredCypressEnvVars).forEach((key) => {
    if (requiredCypressEnvVars[key] === 'undefined') {
      throw new Error(`Required Cypress environment variable "${key}" is undefined`);
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
