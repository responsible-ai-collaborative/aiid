import { gql } from '../../server/generated';

export const FIND_REPORT = gql(`
  query FindReport($filter: ReportFilterType!) {
    report(filter: $filter) {
      url
      title
      description
      authors
      submitters
      date_published
      date_downloaded
      date_modified
      date_submitted
      epoch_date_downloaded
      epoch_date_modified
      epoch_date_published
      epoch_date_submitted
      image_url
      cloudinary_id
      text
      plain_text
      source_domain
      tags
      flag
      report_number
      editor_notes
      language
      is_incident_report
      user {
        userId
      }
      embedding {
        from_text_hash
        vector
      }
      quiet
    }
  }
`);

export const FIND_REPORT_WITH_TRANSLATIONS = gql(`
  query FindReportWithTranslations($filter: ReportFilterType!) {
    report(filter: $filter) {
      url
      title
      authors
      submitters
      date_published
      date_downloaded
      date_modified
      image_url
      text
      plain_text
      tags
      flag
      report_number
      editor_notes
      language
      is_incident_report
      inputs_outputs
      quiet
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
      translations_ja: translations(input: "ja") {
        title
        text
      }
    }
  }
`);

export const UPDATE_REPORT = gql(`
  mutation UpdateReport($filter: ReportFilterType!, $update: ReportUpdateType!) {
    updateOneReport(filter: $filter, update: $update) {
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
      quiet
    }
  }
`);

export const DELETE_REPORT = gql(`
  mutation DeleteOneReport($filter: ReportFilterType!) {
    deleteOneReport(filter: $filter) {
      report_number
    }
  }
`);

// There is no built-in support for making easy array operations in Realm yet, so this is somewhat inefficient
// https://feedback.mongodb.com/forums/923521-realm/suggestions/40765336-adding-or-removing-elements-from-array-fields

export const LINK_REPORTS_TO_INCIDENTS = gql(`
  mutation LinkReportsToIncidents($input: LinkReportsToIncidentsInput!) {
    linkReportsToIncidents(input: $input) {
      incident_id
      reports {
        report_number
      }
    }
  }
`);

export const FIND_REPORT_HISTORY = gql(`
  query FindReportHistory($filter: History_reportFilterType) {
    history_reports(filter: $filter, sort: { date_modified: DESC }) {
      _id
      authors
      cloudinary_id
      date_downloaded
      date_modified
      date_published
      date_submitted
      description
      editor_notes
      embedding {
        from_text_hash
        vector
      }
      epoch_date_downloaded
      epoch_date_modified
      epoch_date_published
      epoch_date_submitted
      flag
      image_url
      inputs_outputs
      is_incident_report
      language
      modifiedBy
      plain_text
      report_number
      submitters
      tags
      text
      title
      url
      source_domain
      user
      quiet
    }
  }
`);

export const FIND_REPORTS = gql(`
  query FindReports($filter: ReportFilterType!) {
    reports(filter: $filter) {
      _id
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
  }
`);

export const FIND_REPORTS_TABLE = gql(`
  query FindReportsTable($filter: ReportFilterType!) {
    reports(filter: $filter, sort: { report_number: DESC }) {
      _id
      submitters
      date_published
      date_downloaded
      date_submitted
      date_modified
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
      editor_notes
      is_incident_report
    }
  }
`);

export const FLAG_REPORT = gql(`
  mutation FlagReport($report_number: Int!, $input: Boolean!) {
    flagReport(report_number: $report_number, input: $input) {
      report_number
      flag
      date_modified
      epoch_date_modified
    }
  }
`);
