import { gql } from '../../server/generated';

export const FIND_USERS = gql(`
  query FindUsers {
    users {
      roles
      userId
      first_name
      last_name
      api_access_blocked
      api_access_blocked_at
      api_access_blocked_reason
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
      api_access_blocked
      api_access_blocked_at
      api_access_blocked_reason
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

/**
 * Blocks or unblocks an account's access to the API.
 *
 * Admin-only, enforced server-side by `canEditApiAccess` (SEE: server/rules.ts)
 * because `updateOneUser` otherwise also permits a user to edit their own record.
 */
export const UPDATE_USER_API_ACCESS = gql(`
  mutation UpdateUserApiAccess(
    $userId: String
    $api_access_blocked: Boolean
    $api_access_blocked_at: DateTime
    $api_access_blocked_reason: String
  ) {
    updateOneUser(
      filter: { userId: { EQ: $userId } }
      update: {
        set: {
          api_access_blocked: $api_access_blocked
          api_access_blocked_at: $api_access_blocked_at
          api_access_blocked_reason: $api_access_blocked_reason
        }
      }
    ) {
      userId
      api_access_blocked
      api_access_blocked_at
      api_access_blocked_reason
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
