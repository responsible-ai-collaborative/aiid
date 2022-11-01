const { gql, ApolloClient, HttpLink, InMemoryCache } = require('@apollo/client');

const config = require('../config');

const Realm = require('realm-web');

const { fetch } = require('cross-fetch');

const getValidAccessToken = async () => {
  const realmApp = new Realm.App({
    id: config.realm.review_db.realm_app_id,
  });

  let credentials = Realm.Credentials.apiKey(config.realm.graphqlApiKey);

  await realmApp.logIn(credentials);

  return realmApp.currentUser.accessToken;
};

const client = new ApolloClient({
  link: new HttpLink({
    uri: `https://realm.mongodb.com/api/client/v2.0/app/${config.realm.production_db.realm_app_id}/graphql`,
    fetch: async (uri, options) => {
      const accessToken = await getValidAccessToken();

      options.headers.Authorization = `Bearer ${accessToken}`;
      return fetch(uri, options);
    },
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Incident: {
        keyFields: ['incident_id'],
        fields: {
          reports: {
            merge(existing, incoming = []) {
              return [...incoming];
            },
          },
        },
      },
      Report: {
        keyFields: ['report_number'],
      },
    },
  }),
});

const processNotifications = async () => {
  const PROCESS_NOTIFICATIONS = gql`
    mutation ProcessNotifications {
      processNotifications {
        _id
        incident_id
        processed
        sentDate
        type
      }
    }
  `;

  const processResult = await client.mutate({
    mutation: PROCESS_NOTIFICATIONS,
    variables: {},
  });

  return processResult;
};

module.exports = processNotifications;
