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
    loginWithEmail: ({ email, password }) => {
      email;
      password;
    },
    loginWithFacebook: ({ loginRedirectUri }) => {
      loginRedirectUri;
    },
    loginWithGoogle: ({ loginRedirectUri }) => {
      loginRedirectUri;
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
    signUp: ({ email, password }) => {
      email;
      password;
    },
  },
});

export const useUserContext = () => useContext(UserContext);
