import gql from 'graphql-tag';

export const DELETE_SUBMISSION = gql`
  mutation DeleteSubmission($_id: ObjectId!) {
    deleteOneSubmission(query: { _id: $_id }) {
      _id
    }
  }
`;

export const FIND_SUBMISSIONS = gql`
  query FindSubmissions {
    submissions(limit: 200) {
      _id
      cloudinary_id
      date_downloaded
      date_modified
      date_published
      date_submitted
      description
      image_url
      incident_date
      incident_id
      incident_editors
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
    }
  }
`;

export const FIND_SUBMISSION = gql`
  query FindSubmission($query: SubmissionQueryInput!) {
    submission(query: $query) {
      _id
      cloudinary_id
      date_downloaded
      date_modified
      date_published
      date_submitted
      description
      image_url
      incident_date
      incident_id
      incident_editors
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
    }
  }
`;

export const UPDATE_SUBMISSION = gql`
  mutation UpdateSubmission($query: SubmissionQueryInput!, $set: SubmissionUpdateInput!) {
    updateOneSubmission(query: $query, set: $set) {
      _id
      cloudinary_id
      date_downloaded
      date_modified
      date_published
      date_submitted
      description
      image_url
      incident_date
      incident_id
      incident_editors
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
    }
  }
`;

export const INSERT_SUBMISSION = gql`
  mutation InsertSubmission($submission: SubmissionInsertInput!) {
    insertOneSubmission(data: $submission) {
      _id
    }
  }
`;

export const PROMOTE_SUBMISSION = gql`
  mutation PromoteSubmission($input: PromoteSubmissionToReportInput!) {
    promoteSubmissionToReport(input: $input) {
      incident_ids
      report_number
    }
  }
`;
