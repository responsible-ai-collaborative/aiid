import { gql } from '../../server/generated';

export const UPSERT_SUBSCRIPTION = gql(`
  mutation UpsertSubscription($filter: SubscriptionFilterType!, $update: SubscriptionInsertType!) {
    upsertOneSubscription(filter: $filter, update: $update) {
      _id
    }
  }
`);

export const FIND_SUBSCRIPTIONS = gql(`
  query FindSubscriptions($filter: SubscriptionFilterType!) {
    subscriptions(filter: $filter) {
      userId {
        userId
      }
    }
  }
`);

export const FIND_FULL_SUBSCRIPTIONS = gql(`
  query FindSubscriptionsFull($filter: SubscriptionFilterType!) {
    subscriptions(filter: $filter) {
      _id
      incident_id {
        incident_id
        title
      }
      entityId {
        entity_id
        name
      }
      type
      userId {
        userId
      }
    }
  }
`);

export const DELETE_SUBSCRIPTIONS = gql(`
  mutation DeleteSubscriptions($filter: SubscriptionFilterType!) {
    deleteManySubscriptions(filter: $filter) {
      deletedCount
    }
  }
`);

export const DELETE_SUBSCRIPTION = gql(`
  mutation DeleteSubscription($filter: SubscriptionFilterType!) {
    deleteOneSubscription(filter: $filter) {
      _id
    }
  }
`);

export const FIND_USER_SUBSCRIPTIONS = gql(`
  query FindUserSubscriptions($filter: SubscriptionFilterType!) {
    subscriptions(filter: $filter) {
      _id
      incident_id {
        incident_id
        title
      }
      entityId {
        entity_id
        name
      }
      userId {
        userId
      }
      type
    }
  }
`);
