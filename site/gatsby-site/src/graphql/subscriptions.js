import gql from 'graphql-tag';

export const UPSERT_SUBSCRIPTION = gql`
  mutation UpsertSubscription(
    $query: SubscriptionQueryInput
    $subscription: SubscriptionInsertInput!
  ) {
    upsertOneSubscription(query: $query, data: $subscription) {
      _id
    }
  }
`;

export const FIND_SUBSCRIPTIONS = gql`
  query FindSubscriptions($query: SubscriptionQueryInput!) {
    subscriptions(query: $query) {
      userId {
        userId
      }
    }
  }
`;

export const DELETE_SUBSCRIPTIONS = gql`
  mutation DeleteSubscriptions($query: SubscriptionQueryInput) {
    deleteManySubscriptions(query: $query) {
      deletedCount
    }
  }
`;

export const FIND_USER_SUBSCRIPTIONS = gql`
  query FindUserSubscriptions($query: SubscriptionQueryInput!) {
    subscriptions(query: $query) {
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
    }
  }
`;
