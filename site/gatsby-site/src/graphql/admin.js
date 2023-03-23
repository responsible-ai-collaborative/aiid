import gql from 'graphql-tag';

export const FIND_USERS = gql`
  query FindUsers {
    users {
      roles
      userId
      adminData {
        email
        disabled
        creationDate
        lastAuthenticationDate
      }
    }
  }
`;
