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
    uri: `https://services.cloud.mongodb.com/api/client/v2.0/app/${process.env.GATSBY_REALM_APP_ID}/graphql`,
    fetch: async (uri, options) => {
      const accessToken = await getValidAccessToken();

      options.headers.Authorization = `Bearer ${accessToken}`;
      return fetch(uri, options);
    },
  }),
  cache: new apolloClient.InMemoryCache(),
});

const createAdminUser = async () => {
  const mutationResult = await client.mutate({
    mutation: apolloClient.gql`
      mutation CreateDefaultAdminUser($input: CreateDefaultAdminUserInput) {
        createDefaultAdminUser(input: $input) {
          userId
          status
          message
        }
      }
    `,
    variables: {
      input: {
        email: process.env.E2E_ADMIN_USERNAME,
        password: process.env.E2E_ADMIN_PASSWORD,
      },
    },
  });

  return mutationResult;
};

// Runs on Post build
export const onPostBuild = async function ({
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
    await run('echo', ['Checking and creating the default Admin user...\n']);

    const result = await createAdminUser();

    console.log('result', result);

    await run('echo', [
      result?.data?.createDefaultAdminUser?.userId
        ? `${result?.data?.createDefaultAdminUser?.userId} Admin user created`
        : 'Admin user already exists',
    ]);
  } catch (error) {
    // Report a user error
    build.failBuild('Error message', { error });
  }

  // Display success information
  status.show({ summary: 'Success!' });
};
