import apolloClient from '@apollo/client';

import { fetch } from 'cross-fetch';

const config = {
  SITE_URL: process.env.SITE_URL,
  PROCESS_NOTIFICATIONS_SECRET: process.env.PROCESS_NOTIFICATIONS_SECRET,
};

Object.keys(config).forEach((key) => {
  if (config[key] === undefined) {
    throw new Error(`Config property ${key} is undefined`);
  }
});

const client = new apolloClient.ApolloClient({
  link: new apolloClient.HttpLink({
    uri: `${config.SITE_URL}/api/graphql`,
    fetch: async (uri, options) => {
      options.headers.PROCESS_NOTIFICATIONS_SECRET = config.PROCESS_NOTIFICATIONS_SECRET;

      return fetch(uri, options);
    },
  }),
  cache: new apolloClient.InMemoryCache(),
});

const processNotifications = async () => {
  const PROCESS_NOTIFICATIONS = apolloClient.gql`
    mutation ProcessNotifications {
      processNotifications
    }
  `;

  const processResult = await client.mutate({
    mutation: PROCESS_NOTIFICATIONS,
    variables: {},
  });

  return processResult;
};

processNotifications();

// Runs on build success
export const onSuccess = async function ({
  // Core utilities
  utils: {
    // Utility to report errors.
    // See https://github.com/netlify/build#error-reporting
    build,
    // Utility to display information in the deploy summary.
    // See https://github.com/netlify/build#logging
    status,
    // Utility for running commands.
    // See https://github.com/netlify/build/blob/master/packages/run-utils#readme
    run,
  },
}) {
  try {
    // Commands are printed in Netlify logs
    await run('echo', ['Processing pending notifications...\n']);

    const result = await processNotifications();

    await run('echo', [`${result?.data?.processNotifications} notifications were processed!`]);
  } catch (error) {
    // Report a user error
    build.failBuild('Error message', { error });
  }

  // Display success information
  status.show({ summary: 'Success!' });
};
