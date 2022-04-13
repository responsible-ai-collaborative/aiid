import gql from 'graphql-tag';

export const DELETE_SUBMISSION = gql`
  mutation DeleteSubmission($_id: ObjectId!) {
    deleteOneSubmission(query: { _id: $_id }) {
      _id
    }
  }
`;
