import gql from 'graphql-tag';

export const INSERT_SUBSCRIPTION = gql`
  mutation InsertSubscription($subscription: SubscriptionInsertInput!) {
    insertOneSubscription(data: $subscription) {
      _id
    }
  }
`;
