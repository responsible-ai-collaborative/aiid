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

export const FIND_USER = gql`
  query FindUser($query: UserQueryInput!) {
    user(query: $query) {
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

export const UPDATE_USER_ROLES = gql`
  mutation UpdateUserRoles($roles: [String]!, $userId: String) {
    updateOneUser(query: { userId: $userId }, set: { roles: $roles }) {
      roles
      userId
    }
  }
`;
