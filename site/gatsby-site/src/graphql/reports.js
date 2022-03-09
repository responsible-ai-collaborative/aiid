import gql from 'graphql-tag';

export const FIND_REPORT = gql`
  query FindReport($query: ReportQueryInput!) {
    report(query: $query) {
      _id
      url
      title
      authors
      submitters
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
  mutation UpdateIncidentReport($query: ReportQueryInput!, $set: ReportUpdateInput!) {
    updateOneReport(query: $query, set: $set) {
      _id
      url
      title
      authors
      submitters
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

export const DELETE_REPORT = gql`
  mutation deleteOneIncident($query: ReportQueryInput!) {
    deleteOneIncident(query: $query) {
      _id
      incident_id
    }
  }
`;
