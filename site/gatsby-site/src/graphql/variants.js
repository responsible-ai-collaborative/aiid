import { gql } from '../../server/generated';

export const FIND_VARIANTS = gql(`
  query FindVariants {
    reports(filter: { OR: [{ title: { EQ: "" } }, { url: { EQ: "" } }, { source_domain: { EQ: "" } }] }) {
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
      plain_text
      authors
      date_downloaded 
      epoch_date_modified
      epoch_date_published
      epoch_date_submitted
      language
      tags
      inputs_outputs
    }
  }
`);

export const FIND_INCIDENT_VARIANTS = gql(`
  query FindIncidentVariants($incident_id: Int!) {
    incident(filter: { incident_id: { EQ: $incident_id } }) {
      incident_id
      reports {
        report_number
        title
        text
        url
        source_domain
        date_published
        tags
        inputs_outputs
      }
    }
  }
`);

export const FIND_VARIANT = gql(`
  query FindVariant($filter: ReportFilterType) {
    report(filter: $filter) {
      report_number
      title
      date_published
      submitters
      text
      tags
      inputs_outputs
    }
  }
`);

export const CREATE_VARIANT = gql(`
  mutation CreateVariant($input: CreateVariantInput!) {
    createVariant(input: $input) {
      incident_id
      report_number
    }
  }
`);

export const UPDATE_VARIANT = gql(`
  mutation UpdateVariant($filter: ReportFilterType!, $update: ReportUpdateType!) {
    updateOneReport(filter: $filter, update: $update) {
      url
      title
      authors
      submitters
      date_published
      date_downloaded
      date_modified
      epoch_date_published
      date_downloaded
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
`);

export const DELETE_VARIANT = gql(`
  mutation DeleteOneVariant($filter: ReportFilterType!) {
    deleteOneReport(filter: $filter) {
      report_number
    }
  }
`);
