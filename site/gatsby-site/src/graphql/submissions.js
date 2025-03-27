import { gql } from '../../server/generated';

export const DELETE_SUBMISSION = gql(`
  mutation DeleteSubmission($_id: ObjectId!) {
    deleteOneSubmission(filter: { _id: { EQ: $_id } }) {
      _id
    }
  }
`);

export const FIND_SUBMISSIONS = gql(`
  query FindSubmissions {
    submissions {
      _id
      cloudinary_id
      date_downloaded
      date_modified
      date_published
      date_submitted
      description
      image_url
      incident_date
      incident_ids
      incident_editors {
        first_name
        last_name
        userId
      }
      incident_title
      language
      source_domain
      text
      title
      authors
      submitters
      url
      editor_notes
      tags
      nlp_similar_incidents {
        similarity
        incident_id
      }
      editor_similar_incidents
      editor_dissimilar_incidents
      plain_text
      developers {
        entity_id
        name
      }
      deployers {
        entity_id
        name
      }
      harmed_parties {
        entity_id
        name
      }
      status
      user {
        userId
      }
      quiet
      implicated_systems {
        entity_id
        name
      }
    }
  }
`);

export const FIND_SUBMISSION = gql(`
  query FindSubmission($filter: SubmissionFilterType!) {
    submission(filter: $filter) {
      _id
      cloudinary_id
      date_downloaded
      date_modified
      date_published
      date_submitted
      description
      image_url
      incident_date
      incident_ids
      incident_editors {
        first_name
        last_name
        userId
      }
      incident_title
      language
      source_domain
      text
      title
      authors
      submitters
      url
      editor_notes
      tags
      developers {
        entity_id
        name
      }
      deployers {
        entity_id
        name
      }
      harmed_parties {
        entity_id
        name
      }
      nlp_similar_incidents {
        similarity
        incident_id
      }
      editor_similar_incidents
      editor_dissimilar_incidents
      status
      quiet
      implicated_systems {
        entity_id
        name
      }
    }
  }
`);

export const UPDATE_SUBMISSION = gql(`
  mutation UpdateSubmission($filter: SubmissionFilterType!, $update: SubmissionUpdateType!) {
    updateOneSubmission(filter: $filter, update: $update) {
      _id
      cloudinary_id
      date_downloaded
      date_modified
      date_published
      date_submitted
      description
      image_url
      incident_date
      incident_ids
      incident_editors {
        first_name
        last_name
        userId
      }
      incident_title
      language
      source_domain
      text
      title
      authors
      submitters
      url
      editor_notes
      tags
      developers {
        entity_id
        name
      }
      deployers {
        entity_id
        name
      }
      harmed_parties {
        entity_id
        name
      }
      nlp_similar_incidents {
        similarity
        incident_id
      }
      editor_similar_incidents
      editor_dissimilar_incidents
      implicated_systems {
        entity_id
        name
      }
    }
  }
`);

export const INSERT_SUBMISSION = gql(`
  mutation InsertSubmission($data: SubmissionInsertType!) {
    insertOneSubmission(data: $data) {
      _id
    }
  }
`);

export const PROMOTE_SUBMISSION = gql(`
  mutation PromoteSubmission($input: PromoteSubmissionToReportInput!) {
    promoteSubmissionToReport(input: $input) {
      incident_ids
      report_number
    }
  }
`);
