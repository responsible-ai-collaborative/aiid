import { createContext, useContext } from 'react';

export const UserContext = createContext({ user: {}, loading: true });
export const useUserContext = () => useContext(UserContext);
