import gql from 'graphql-tag';

export const FIND_USERS = gql`
  query FindUsers {
    users {
      roles
      userId
      first_name
      last_name
    }
  }
`;

export const FIND_USERS_FIELDS_ONLY = gql`
  query FindUsers {
    users {
      roles
      userId
      first_name
      last_name
    }
  }
`;

export const FIND_USER = gql`
  query FindUser($query: UserQueryInput!) {
    user(query: $query) {
      roles
      userId
      first_name
      last_name
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

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($userId: String, $first_name: String, $last_name: String) {
    updateOneUser(
      query: { userId: $userId }
      set: { first_name: $first_name, last_name: $last_name }
    ) {
      userId
      first_name
      last_name
    }
  }
`;
