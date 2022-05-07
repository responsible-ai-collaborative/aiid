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
      incident_id
      language
      source_domain
      text
      title
      authors
      submitters
      url
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
      language
      source_domain
      text
      title
      authors
      submitters
      url
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
