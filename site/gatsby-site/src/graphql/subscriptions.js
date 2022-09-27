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
