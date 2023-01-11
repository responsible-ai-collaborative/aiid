import gql from 'graphql-tag';

export const FIND_VARIANTS = gql`
  query FindVariants($query: ReportQueryInput) {
    reports(query: $query, limit: 999) {
      report_number
      title
      date_published
      tags
      text_inputs
      text_outputs
    }
  }
`;

export const FIND_INCIDENT_VARIANTS = gql`
  query FindIncidentVariants($incident_id: Int!) {
    incident(query: { incident_id: $incident_id }) {
      incident_id
      reports {
        report_number
        title
        date_published
        tags
        text_inputs
        text_outputs
      }
    }
  }
`;

export const FIND_VARIANT = gql`
  query FindVariant($query: ReportQueryInput) {
    report(query: $query) {
      report_number
      title
      date_published
      tags
      text_inputs
      text_outputs
    }
  }
`;

export const CREATE_VARIANT = gql`
  mutation CreateVariant($input: CreateVariantInput!) {
    createVariant(input: $input) {
      incident_id
      report_number
    }
  }
`;

export const UPDATE_VARIANT = gql`
  mutation UpdateVariant($query: ReportQueryInput!, $set: ReportUpdateInput!) {
    updateOneReport(query: $query, set: $set) {
      url
      title
      authors
      submitters
      date_published
      date_downloaded
      date_modified
      epoch_date_published
      epoch_date_downloaded
      epoch_date_modified
      image_url
      text
      plain_text
      tags
      flag
      report_number
      editor_notes
      language
    }
  }
`;

export const DELETE_VARIANT = gql`
  mutation DeleteOneVariant($query: ReportQueryInput!) {
    deleteOneReport(query: $query) {
      report_number
    }
  }
`;
