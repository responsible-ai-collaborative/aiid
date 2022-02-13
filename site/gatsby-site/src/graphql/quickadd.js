import gql from 'graphql-tag';

export const FIND_QUICKADD = gql`
  query AllQuickAdd($query: QuickaddQueryInput!) {
    quickadds(query: $query) {
      _id
      date_submitted
      url
      source_domain
    }
  }
`;

export const DELETE_QUICKADD = gql`
  mutation DeleteOneQuickAdd($query: QuickaddQueryInput) {
    deleteManyQuickadds(query: $query) {
      deletedCount
    }
  }
`;
