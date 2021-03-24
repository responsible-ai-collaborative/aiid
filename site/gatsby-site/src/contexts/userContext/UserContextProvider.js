import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as Realm from 'realm-web';

import { realmApp } from 'services/realmApp';

import { UserContext } from './UserContext';

// A MongoDB interface component managing the privileged user state.
// There are two authentication states for the API:
//
// 1. Anonymous users. These are permitted to make submissions to the database, but they
//    are not permitted to accept reports into the main incident database.
// 2. Authenticated users. These are permitted to accept reports into the database.
//
// Authenticated token users are added to the database in the MongoDB UI.
//
// https://docs.mongodb.com/realm/web/mongodb/

export const UserContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState();

  const [type, setType] = useState();

  const [mongoUserKey, setMongoUserKey] = useState();

  const setUserAPIKey = useCallback((apiKey) => {
    setMongoUserKey(apiKey);
    window.localStorage.setItem('mongoUserKey', apiKey);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem('mongoUserKey');
  }, []);

  useEffect(() => {
    const apiKey = window.localStorage.getItem('mongoUserKey');

    setMongoUserKey(apiKey);
  }, []);

  useEffect(() => {
    setLoading(true);
    const credentials = mongoUserKey
      ? Realm.Credentials.apiKey(mongoUserKey)
      : Realm.Credentials.anonymous();

    setType(mongoUserKey ? 'token' : 'anonymous');

    realmApp
      .logIn(credentials)
      .then((res) => {
        setUser(res);
        console.log(`Logged in as ${type} user:`, user);
      })
      .catch((e) => {
        console.log('RealmApp login Failed: ', e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [mongoUserKey]);

  return (
    <UserContext.Provider
      value={useMemo(
        () => ({
          loading,
          user,
          mongoUserKey,
          isAdmin: type === 'token',
          isLoggedIn: !!user,
          actions: {
            setUserAPIKey,
            logout,
          },
        }),
        [loading, user, type, setUserAPIKey, logout]
      )}
    >
      {children}
    </UserContext.Provider>
  );
};
