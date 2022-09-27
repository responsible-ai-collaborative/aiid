import gql from 'graphql-tag';

export const GET_USER = gql`
  mutation GetUser($input: GetUserInput!) {
    getUser(input: $input) {
      email
    }
  }
`;
