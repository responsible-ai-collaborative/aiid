import React, { useEffect, useRef, useState } from 'react';
import * as Realm from 'realm-web';
import { realmApp } from 'services/realmApp';
import { UserContext } from './UserContext';
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import config from '../../../config';
import fetch from 'cross-fetch';

// https://github.com/mongodb-university/realm-graphql-apollo-react/blob/master/src/index.js

const getApolloCLient = (getValidAccessToken) =>
  new ApolloClient({
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

export const UserContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(realmApp.currentUser);

  const logout = async () => {
    await realmApp.currentUser.logOut();

    //TODO: functions need at least an anon user to work
    await login();
  };

  const login = async ({ email = null, password = null } = {}) => {
    let credentials = null;

    if (email && password) {
      credentials = Realm.Credentials.emailPassword(email, password);
    } else {
      credentials = Realm.Credentials.anonymous();
    }

    const user = await realmApp.logIn(credentials);

    if (user.id === realmApp.currentUser.id) {
      setUser(user);
    }
  };

  const sendResetPasswordEmail = async ({ email }) => {
    return realmApp.emailPasswordAuth.sendResetPasswordEmail(email);
  };

  const resetPassword = async ({ password, token, tokenId }) => {
    return realmApp.emailPasswordAuth.resetPassword(token, tokenId, password);
  };

  const signUp = async ({ email, password }) => {
    return realmApp.emailPasswordAuth.registerUser(email, password);
  };

  const getValidAccessToken = async () => {
    if (!realmApp.currentUser) {
      await login();
    } else {
      await realmApp.currentUser.refreshCustomData();
    }

    return realmApp.currentUser.accessToken;
  };

  const client = useRef(getApolloCLient(getValidAccessToken)).current;

  useEffect(() => {
    async function checkUser() {
      if (!user || !user.isLoggedIn) {
        await login();
      }

      setLoading(false);
    }

    checkUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        loading,
        user,
        isLoggedIn: user && user.isLoggedIn,
        isRole(role) {
          return (
            user &&
            user.isLoggedIn &&
            user.customData.roles &&
            (user.customData.roles.includes('admin') || user.customData.roles.includes(role))
          );
        },
        isAdmin:
          user &&
          user.isLoggedIn &&
          user.customData.roles &&
          user.customData.roles.includes('admin'),
        actions: {
          login,
          logout,
          sendResetPasswordEmail,
          resetPassword,
          signUp,
        },
      }}
    >
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </UserContext.Provider>
  );
};
