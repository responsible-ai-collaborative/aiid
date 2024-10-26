import { gql } from '../../server/generated';

export const FIND_INCIDENT = gql(`
  query FindIncident($filter: IncidentFilterType) {
    incident(filter: $filter) {
      incident_id
      title
      description
      editors {
        userId
        first_name
        last_name
      }
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
      editor_notes
    }
  }
`);

export const FIND_INCIDENTS_TABLE = gql(`
  query FindIncidentsTable($filter: IncidentFilterType) {
    incidents(filter: $filter) {
      incident_id
      title
      description
      editors {
        userId
        first_name
        last_name
      }
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
      reports {
        report_number
      }
    }
  }
`);

export const FIND_INCIDENT_ENTITIES = gql(`
  query FindIncidentEntities($filter: IncidentFilterType) {
    incident(filter: $filter) {
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
`);

export const FIND_INCIDENTS = gql(`
  query FindIncidents($filter: IncidentFilterType) {
    incidents(filter: $filter) {
      incident_id
      title
      description
      editors {
        userId
        first_name
        last_name
      }
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
`);

export const FIND_INCIDENTS_TITLE = gql(`
  query FindIncidentsTitles($filter: IncidentFilterType) {
    incidents(filter: $filter) {
      incident_id
      title
    }
  }
`);

export const UPDATE_INCIDENT = gql(`
  mutation UpdateIncident($filter: IncidentFilterType!, $update: IncidentUpdateType!) {
    updateOneIncident(filter: $filter, update: $update) {
      incident_id
      title
      description
      editors {
        userId
        first_name
        last_name
      }
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
      editor_notes
    }
  }
`);

export const UPDATE_INCIDENTS = gql(`
  mutation UpdateIncidents($filter: IncidentFilterType!, $update: IncidentUpdateType!) {
    updateManyIncidents(filter: $filter, update: $update) {
      matchedCount
      modifiedCount
    }
  }
`);

export const INSERT_INCIDENT = gql(`
  mutation InsertIncident($data: IncidentInsertType!) {
    insertOneIncident(data: $data) {
      incident_id
    }
  }
`);

export const GET_LATEST_INCIDENT_ID = gql(`
  query FindLastIncident {
    incidents(sort: { incident_id: DESC }, pagination: { limit: 1, skip: 0 }) {
      incident_id
    }
  }
`);

export const FIND_FULL_INCIDENT = gql(`
  query FindIncidentFull($filter: IncidentFilterType) {
    incident(filter: $filter) {
      incident_id
      title
      description
      editors {
        userId
        first_name
        last_name
      }
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
        submitters
        date_published
        report_number
        title
        description
        url
        image_url
        cloudinary_id
        source_domain
        text
        authors
        epoch_date_submitted
        language
        tags
        inputs_outputs
      }
      embedding {
        from_reports
        vector
      }
      editor_notes
      epoch_date_modified
      tsne {
        x
        y
      }
    }
  }
`);

export const FIND_INCIDENT_HISTORY = gql(`
  query FindIncidentHistory($filter: History_incidentFilterType) {
    history_incidents(filter: $filter, sort: {epoch_date_modified: DESC}) {
      incident_id
      AllegedDeployerOfAISystem
      AllegedDeveloperOfAISystem
      AllegedHarmedOrNearlyHarmedParties
      _id
      date
      description
      modifiedBy
      editor_dissimilar_incidents
      editor_notes
      editor_similar_incidents
      editors
      embedding {
        from_reports
        vector
      }
      epoch_date_modified
      flagged_dissimilar_incidents
      nlp_similar_incidents {
        incident_id
        similarity
      }
      reports
      title
      tsne {
        x
        y
      }
    }
  }
`);

export const FLAG_INCIDENT_SIMILARITY = gql(`
  mutation FlagIncidentSimilarity($incidentId: Int!, $dissimilarIds: [Int!]) {
    flagIncidentSimilarity(incidentId: $incidentId, dissimilarIds: $dissimilarIds) {
      incident_id
      flagged_dissimilar_incidents
      editors {
        userId
      }
    }
  }
`);
