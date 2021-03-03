import React from 'react';

import { UserContext } from './UserContext';
import { useUser } from 'mongodb/useUser';

export const UserContextProvider = ({ children }) => {
  const { loading, user, isAdmin } = useUser();

  return <UserContext.Provider value={{ loading, user, isAdmin }}>{children}</UserContext.Provider>;
};
