import gql from 'graphql-tag';

export const FIND_QUICKADD = gql`
  query AllQuickAdd($filter: QuickAddFilterType!) {
    quickadds(filter: $filter) {
      _id
      date_submitted
      url
      source_domain
    }
  }
`;

export const DELETE_QUICKADD = gql`
  mutation DeleteOneQuickAdd($filter: QuickAddFilterType) {
    deleteManyQuickadds(filter: $filter) {
      deletedCount
    }
  }
`;

export const INSERT_QUICKADD = gql`
  mutation InsertQuickAdd($data: QuickAddInsertType!) {
    insertOneQuickadd(data: $data) {
      _id
    }
  }
`;
