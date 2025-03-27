import { gql } from '../../server/generated';

export const FIND_USERS = gql(`
  query FindUsers {
    users {
      roles
      userId
      first_name
      last_name
    }
  }
`);

export const FIND_USER = gql(`
  query FindUser($filter: UserFilterType!) {
    user(filter: $filter) {
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
`);

export const FIND_USERS_BY_ROLE = gql(`
  query FindUsersByRole($role: [String!]) {
    users(filter: { roles: { IN: $role } }) {
      roles
      userId
      first_name
      last_name
    }
  }
`);

export const UPDATE_USER_ROLES = gql(`
  mutation UpdateUserRoles($roles: [String]!, $userId: String) {
    updateOneUser(filter: { userId: { EQ: $userId } }, update: { set: { roles: $roles } }) {
      roles
      userId
    }
  }
`);

export const UPDATE_USER_PROFILE = gql(`
  mutation UpdateUserProfile($userId: String, $first_name: String, $last_name: String) {
    updateOneUser(
      filter: { userId: { EQ: $userId } }
      update: { set: { first_name: $first_name, last_name: $last_name } }
    ) {
      userId
      first_name
      last_name
    }
  }
`);
