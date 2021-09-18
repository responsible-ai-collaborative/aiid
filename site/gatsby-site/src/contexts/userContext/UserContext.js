import { createContext, useContext } from 'react';

export const UserContext = createContext({
  loading: undefined,
  user: undefined,
  isAdmin: false,
  isLoggedIn: undefined,
  actions: {
    login: () => {},
    logout: () => {},
    sendResetPasswordEmail: () => {},
    resetPassword: () => {},
  },
});

export const useUserContext = () => useContext(UserContext);
