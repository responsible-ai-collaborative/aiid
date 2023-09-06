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
