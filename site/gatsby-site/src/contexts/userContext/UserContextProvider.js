import React, { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState();

  const logout = () => {
    return realmApp.currentUser.logOut();
  };

  const login = async ({ apiKey, email, password } = {}) => {
    let credentials = null;

    if (apiKey) {
      credentials = Realm.Credentials.apiKey(apiKey);
    } else if (email && password) {
      credentials = Realm.Credentials.emailPassword(email, password);
    } else {
      credentials = Realm.Credentials.anonymous();
    }

    try {
      const user = await realmApp.logIn(credentials);

      if (user.id === realmApp.currentUser.id) {
        setUser(user);
        return user;
      }
    } catch (err) {
      console.error('Failed to log in', err);
    }

    return null;
  };

  useEffect(() => {
    setLoading(true);

    const init = async () => {
      if (!realmApp.currentUser.isLoggedIn) {
        await login();
      }

      setLoading(false);
    };

    init();
  }, []);

  return (
    <UserContext.Provider
      value={{
        loading,
        user,
        isAdmin: false, //TODO: type === 'token',
        isLoggedIn: !!user,
        actions: {
          login,
          logout,
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
