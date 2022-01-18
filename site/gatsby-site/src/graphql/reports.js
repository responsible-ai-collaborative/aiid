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
      image_url
      incident_id
      text
      flag
    }
  }
`;
