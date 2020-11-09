import React from 'react';
import * as Realm from "realm-web";
import config from '../../config';

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

const REALM_APP_ID = config["realm"]["review_db"]["realm_app_id"];
export const realmApp = new Realm.App({
  id: REALM_APP_ID,
  timeout: 10000 // timeout in number of milliseconds
});

const isBrowser = () => typeof window !== "undefined";

export const getUserAPIKey = () =>
  isBrowser() && window.localStorage.getItem("mongoUserKey")
    ? window.localStorage.getItem("mongoUserKey")
    : "";

export const setUserAPIKey = apiKey =>
    window.localStorage.setItem("mongoUserKey", apiKey);

export const isLoggedIn = () => {
  const user = getUser();
  return !!user.mongoUserKey;
}
export const logout = () =>
  window.localStorage.removeItem("mongoUserKey");

export async function getUser(callback=function(){}) {
  const apiKey = getUserAPIKey();
  let user, type;
  if(apiKey) {
    const credentials = Realm.Credentials.apiKey(apiKey);
    user = await realmApp.logIn(credentials);
    type = "token";
    console.log(`Logged in token API user: ${user}`);
  } else {
    user = await realmApp.logIn(Realm.Credentials.anonymous());
    type = "anonymous"
    console.log(`Logged in anonymous user: ${user}`);
  }
  callback();
  return {"user": user, "type": type};
}
