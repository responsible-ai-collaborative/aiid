import { gql } from '../../server/generated/gql';

export const MACHINE_CLASSIFICATION_BY_INCIDENT_ID = gql(`
  mutation MachineClassificationByIncidentId($incident_id: Int!, $taxonomy: String!) {
    machineClassificationByIncidentId(incident_id: $incident_id, taxonomy: $taxonomy) {
      confidence
      explanation
      classification {
        namespace
        attributes {
          short_name
          value_json
        }
      }
    }
  }
`);
