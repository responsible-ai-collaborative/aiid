import gql from 'graphql-tag';

export const FIND_INCIDENT_VARIANTS = gql`
  query FindIncidentVariants($report_numbers: [Int]!) {
    reports(
      query: {
        AND: [
          { report_number_in: $report_numbers }
          { text_inputs_exists: true }
          { text_outputs_exists: true }
          { text_inputs_ne: "" }
          { text_outputs_ne: "" }
        ]
      }
    ) {
      report_number
      title
      date_published
      tags
      text_inputs
      text_outputs
    }
  }
`;

export const INSERT_VARIANT = gql`
  mutation InsertVariant($report: ReportInsertInput!) {
    insertOneReport(data: $report) {
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
