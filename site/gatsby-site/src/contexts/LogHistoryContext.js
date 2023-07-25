import React, { createContext, useContext } from 'react';
import { useMutation } from '@apollo/client/react/hooks';
import { transformIncidentData } from '../utils/cite';
import { LOG_INCIDENT_HISTORY } from '../graphql/incidents';

const LogHistoryContext = createContext({
  logIncidentHistory(incident, user) {
    incident;
    user;
  },
});

export default LogHistoryContext;

export function LogHistoryContextProvider({ children }) {
  const [logIncidentHistoryMutation] = useMutation(LOG_INCIDENT_HISTORY);

  const logIncidentHistory = async (incident, user) => {
    const updatedIncident = transformIncidentData(incident, user);

    await logIncidentHistoryMutation({ variables: { input: updatedIncident } });
  };

  return (
    <LogHistoryContext.Provider
      value={{
        logIncidentHistory,
      }}
    >
      {children}
    </LogHistoryContext.Provider>
  );
}

export const useLogHistoryContext = () => useContext(LogHistoryContext);
