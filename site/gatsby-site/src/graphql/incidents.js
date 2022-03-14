import gql from 'graphql-tag';

export const FIND_INCIDENT = gql`
  query FindIncident($query: IncidentQueryInput) {
    incident(query: $query) {
      date
      incident_id
      reports {
        report_number
      }
    }
  }
`;

export const FIND_INCIDENTS = gql`
  query FindIncidents($query: IncidentQueryInput) {
    incidents(query: $query) {
      date
      incident_id
      reports {
        report_number
      }
    }
  }
`;

export const UPDATE_INCIDENT = gql`
  mutation UpdateIncident($query: IncidentQueryInput!, $set: IncidentUpdateInput!) {
    updateOneIncident(query: $query, set: $set) {
      date
      incident_id
      reports {
        report_number
      }
    }
  }
`;

export const LAST_INCIDENT_ID = gql`
  query {
    incidents(sortBy: INCIDENT_ID_DESC, limit: 1) {
      incident_id
    }
  }
`;
