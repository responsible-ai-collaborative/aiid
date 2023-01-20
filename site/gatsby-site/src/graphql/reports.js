import gql from 'graphql-tag';

export const FIND_REPORT = gql`
  query FindReport($query: ReportQueryInput!) {
    report(query: $query) {
      url
      title
      authors
      submitters
      date_published
      date_downloaded
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

export const FIND_REPORT_WITH_TRANSLATIONS = gql`
  query FindReportWithTranslations($query: ReportQueryInput!) {
    report(query: $query) {
      url
      title
      authors
      submitters
      date_published
      date_downloaded
      image_url
      text
      plain_text
      tags
      flag
      report_number
      editor_notes
      language
      is_incident_report
      text_inputs
      text_outputs
      translations_es: translations(input: "es") {
        title
        text
      }
      translations_en: translations(input: "en") {
        title
        text
      }
      translations_fr: translations(input: "fr") {
        title
        text
      }
    }
  }
`;

export const UPDATE_REPORT = gql`
  mutation UpdateReport($query: ReportQueryInput!, $set: ReportUpdateInput!) {
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

export const DELETE_REPORT = gql`
  mutation DeleteOneReport($query: ReportQueryInput!) {
    deleteOneReport(query: $query) {
      report_number
    }
  }
`;

export const INSERT_REPORT = gql`
  mutation InsertReport($report: ReportInsertInput!) {
    insertOneReport(data: $report) {
      report_number
    }
  }
`;

// There is no built-in support for making easy array operations in Realm yet, so this is somewhat inefficient
// https://feedback.mongodb.com/forums/923521-realm/suggestions/40765336-adding-or-removing-elements-from-array-fields

export const LINK_REPORTS_TO_INCIDENTS = gql`
  mutation LinkReportsToIncidents($input: LinkReportsToIncidentsInput) {
    linkReportsToIncidents(input: $input) {
      incident_id
      reports {
        report_number
      }
    }
  }
`;
