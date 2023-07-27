import { useMutation } from '@apollo/client/react/hooks';
import { transformIncidentData } from '../utils/cite';
import { LOG_INCIDENT_HISTORY } from '../graphql/incidents';

export function useLogIncidentHistory() {
  const [logIncidentHistoryMutation] = useMutation(LOG_INCIDENT_HISTORY);

  const logIncidentHistory = async (incident, user) => {
    const updatedIncident = transformIncidentData(incident, user);

    await logIncidentHistoryMutation({ variables: { input: updatedIncident } });
  };

  return { logIncidentHistory };
}

// export function LogHistoryContextProvider({ children }) {
//   const [logIncidentHistoryMutation] = useMutation(LOG_INCIDENT_HISTORY);

//   const logIncidentHistory = async (incident, user) => {
//     const updatedIncident = transformIncidentData(incident, user);

//     await logIncidentHistoryMutation({ variables: { input: updatedIncident } });
//   };

//   const [logReportHistoryMutation] = useMutation(LOG_REPORT_HISTORY);

//   const logReportHistory = async (report, updates, user) => {
//     const transformedReport = transformReportData(report, user);

//     const updatedReport = {
//       ...transformedReport,
//       ...updates,
//     };

//     if (updates.text) {
//       updatedReport.plain_text = await stripMarkdown(updates.text);
//     }

//     // Set the user as the last modifier
//     updatedReport.modifiedBy = user && user.providerType != 'anon-user' ? user.id : '';

//     await logReportHistoryMutation({ variables: { input: updatedReport } });
//   };
// }
