import gql from 'graphql-tag';

export const FIND_INCIDENT = gql`
  query FindIncident($query: IncidentQueryInput) {
    incident(query: $query) {
      incident_id
      title
      description
      date
      AllegedDeployerOfAISystem
      AllegedDeveloperOfAISystem
      AllegedHarmedOrNearlyHarmedParties
      reports {
        report_number
      }
    }
  }
`;

export const FIND_INCIDENTS = gql`
  query FindIncidents($query: IncidentQueryInput) {
    incidents(query: $query, limit: 999) {
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

export const INSERT_INCIDENT = gql`
  mutation InsertIncident($incident: IncidentInsertInput!) {
    insertOneIncident(data: $incident) {
      incident_id
    }
  }
`;
