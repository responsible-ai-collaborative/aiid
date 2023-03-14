import gql from 'graphql-tag';

export const FIND_INCIDENT = gql`
  query FindIncident($query: IncidentQueryInput) {
    incident(query: $query) {
      incident_id
      title
      description
      editors
      date
      AllegedDeployerOfAISystem {
        entity_id
        name
      }
      AllegedDeveloperOfAISystem {
        entity_id
        name
      }
      AllegedHarmedOrNearlyHarmedParties {
        entity_id
        name
      }
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
      embedding {
        from_reports
        vector
      }
    }
  }
`;

export const FIND_INCIDENTS_TABLE = gql`
  query FindIncidents($query: IncidentQueryInput) {
    incidents(query: $query, limit: 999) {
      incident_id
      title
      description
      editors
      date
    }
  }
`;

export const FIND_INCIDENT_ENTITIES = gql`
  query FindIncident($query: IncidentQueryInput) {
    incident(query: $query) {
      incident_id
      AllegedDeployerOfAISystem {
        entity_id
        name
      }
      AllegedDeveloperOfAISystem {
        entity_id
        name
      }
      AllegedHarmedOrNearlyHarmedParties {
        entity_id
        name
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
      AllegedDeployerOfAISystem {
        entity_id
        name
      }
      AllegedDeveloperOfAISystem {
        entity_id
        name
      }
      AllegedHarmedOrNearlyHarmedParties {
        entity_id
        name
      }
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
      embedding {
        from_reports
        vector
      }
    }
  }
`;

export const FIND_INCIDENTS_TITLE = gql`
  query FindIncidentsTitles($query: IncidentQueryInput) {
    incidents(query: $query, limit: 999) {
      incident_id
      title
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
      AllegedDeployerOfAISystem {
        entity_id
        name
      }
      AllegedDeveloperOfAISystem {
        entity_id
        name
      }
      AllegedHarmedOrNearlyHarmedParties {
        entity_id
        name
      }
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
      embedding {
        from_reports
        vector
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
