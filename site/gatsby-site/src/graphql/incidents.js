import gql from 'graphql-tag';

export const FIND_INCIDENT = gql`
  query FindIncident($query: IncidentQueryInput) {
    incident(query: $query) {
      incident_id
      title
      description
      editors
      date
      AllegedDeployerOfAISystem
      AllegedDeveloperOfAISystem
      AllegedHarmedOrNearlyHarmedParties
      nlp_similar_incidents {
        incident_id
        similarity
      }
      editor_similar_incidents
      editor_dissimilar_incidents
      flagged_dissimilar_incidents
      reports {
        report_number
      }
    }
  }
`;

export const FIND_INCIDENTS = gql`
  query FindIncidents($query: IncidentQueryInput) {
    incidents(query: $query, limit: 999) {
      incident_id
      title
      description
      editors
      date
      AllegedDeployerOfAISystem
      AllegedDeveloperOfAISystem
      AllegedHarmedOrNearlyHarmedParties
      nlp_similar_incidents {
        incident_id
        similarity
      }
      editor_similar_incidents
      editor_dissimilar_incidents
      flagged_dissimilar_incidents
      reports {
        report_number
      }
    }
  }
`;

export const UPDATE_INCIDENT = gql`
  mutation UpdateIncident($query: IncidentQueryInput!, $set: IncidentUpdateInput!) {
    updateOneIncident(query: $query, set: $set) {
      incident_id
      title
      description
      editors
      date
      AllegedDeployerOfAISystem
      AllegedDeveloperOfAISystem
      AllegedHarmedOrNearlyHarmedParties
      nlp_similar_incidents {
        incident_id
        similarity
      }
      editor_similar_incidents
      editor_dissimilar_incidents
      flagged_dissimilar_incidents
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
