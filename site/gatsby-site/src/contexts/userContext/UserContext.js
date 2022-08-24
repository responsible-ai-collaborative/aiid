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
    login: () => {},
    logout: () => {},
    sendResetPasswordEmail: () => {},
    resetPassword: () => {},
  },
});

export const useUserContext = () => useContext(UserContext);
