import { createContext, useContext } from 'react';

export const UserContext = createContext({
  loading: false,
  user: null,
  mongoUserKey: '',
  isAdmin: false,
  isLoggedIn: false,
  actions: {
    setUserAPIKey: () => {},
    logout: () => {},
  },
});
export const useUserContext = () => useContext(UserContext);
