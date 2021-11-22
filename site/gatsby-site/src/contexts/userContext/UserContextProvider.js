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

  const [user, setUser] = useState(realmApp.currentUser);

  const logout = async () => {
    await realmApp.currentUser.logOut();

    //TODO: functions need at least an anon user to work
    await login();
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
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
