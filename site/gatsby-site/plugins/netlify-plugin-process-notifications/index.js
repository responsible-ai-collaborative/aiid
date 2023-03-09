import apolloClient from '@apollo/client';

import Realm from 'realm-web';

import { fetch } from 'cross-fetch';

const getValidAccessToken = async () => {
  const realmApp = new Realm.App({
    id: process.env.GATSBY_REALM_APP_ID,
  });

  let credentials = Realm.Credentials.apiKey(process.env.REALM_GRAPHQL_API_KEY);

  await realmApp.logIn(credentials);

  return realmApp.currentUser.accessToken;
};

const client = new apolloClient.ApolloClient({
  link: new apolloClient.HttpLink({
    uri: `https://realm.mongodb.com/api/client/v2.0/app/${process.env.GATSBY_REALM_APP_ID}/graphql`,
    fetch: async (uri, options) => {
      const accessToken = await getValidAccessToken();

      options.headers.Authorization = `Bearer ${accessToken}`;
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
