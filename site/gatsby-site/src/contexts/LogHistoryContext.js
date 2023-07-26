import React, { createContext, useContext } from 'react';
import { useMutation } from '@apollo/client/react/hooks';
import { transformIncidentData } from '../utils/cite';
import { transformReportData } from '../utils/reports';
import { LOG_INCIDENT_HISTORY } from '../graphql/incidents';
import { LOG_REPORT_HISTORY } from '../graphql/reports';
import { stripMarkdown } from '../utils/typography';

const LogHistoryContext = createContext({
  logIncidentHistory(incident, user) {
    incident;
    user;
  },
  logReportHistory(report, updates, user) {
    report;
    updates;
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

  const [logReportHistoryMutation] = useMutation(LOG_REPORT_HISTORY);

  const logReportHistory = async (report, updates, user) => {
    const transformedReport = transformReportData(report, user);

    const updatedReport = {
      ...transformedReport,
      ...updates,
    };

    if (updates.text) {
      updatedReport.plain_text = await stripMarkdown(updates.text);
    }

    // Set the user as the last modifier
    updatedReport.modifiedBy = user && user.providerType != 'anon-user' ? user.id : '';

    await logReportHistoryMutation({ variables: { input: updatedReport } });
  };

  return (
    <LogHistoryContext.Provider
      value={{
        logIncidentHistory,
        logReportHistory,
      }}
    >
      {children}
    </LogHistoryContext.Provider>
  );
}

export const useLogHistoryContext = () => useContext(LogHistoryContext);
