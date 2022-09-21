import { createContext, useContext } from 'react';

export const UserContext = createContext({
  loading: true,
  user: undefined,
  isAdmin: undefined,
  isLoggedIn: undefined,
  isRole(role) {
    role;
    return false;
  },
  actions: {
    // Dummy functions, will be replaced by actual functions in UserContextProvider.js
    loginWithEmail: ({ email, password, redirectTo }) => {
      email;
      password;
      redirectTo;
    },
    loginWithFacebook: ({ loginRedirectUri, redirectTo }) => {
      loginRedirectUri;
      redirectTo;
    },
    logout: () => {},
    sendResetPasswordEmail: ({ email }) => {
      email;
    },
    resetPassword: ({ password, token, tokenId }) => {
      password;
      token;
      tokenId;
    },
    signUp: ({ email, password, redirectTo }) => {
      email;
      password;
      redirectTo;
    },
    confirmEmail: ({ token, tokenId }) => {
      token;
      tokenId;
      return new Promise(() => {});
    },
  },
});

export const useUserContext = () => useContext(UserContext);
