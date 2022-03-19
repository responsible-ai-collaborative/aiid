import gql from 'graphql-tag';

export const FIND_REPORT = gql`
  query FindReport($query: IncidentQueryInput!) {
    incident(query: $query) {
      _id
      url
      title
      authors
      submitters
      incident_date
      date_published
      date_downloaded
      image_url
      incident_id
      text
      tags
      flag
    }
  }
`;

export const UPDATE_REPORT = gql`
  mutation UpdateIncidentReport($query: IncidentQueryInput!, $set: IncidentUpdateInput!) {
    updateOneIncident(query: $query, set: $set) {
      _id
      url
      title
      authors
      submitters
      incident_date
      date_published
      date_downloaded
      epoch_date_downloaded
      epoch_date_modified
      date_modified
      epoch_date_published
      epoch_incident_date
      image_url
      incident_id
      text
      tags
      flag
    }
  }
`;

export const DELETE_REPORT = gql`
  mutation deleteOneIncident($query: IncidentQueryInput!) {
    deleteOneIncident(query: $query) {
      _id
      incident_id
    }
  }
`;
