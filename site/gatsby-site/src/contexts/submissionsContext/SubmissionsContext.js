import { createContext, useContext } from 'react';

export const SubmissionsContext = createContext({
  loading: false,
  submissions: [],
  actions: {
    refetch: () => {},
  },
});
export const useSubmissionsContext = () => useContext(SubmissionsContext);
