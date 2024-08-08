import { gql } from '../../server/generated';

export const FIND_QUICKADD = gql(`
  query AllQuickAdd($filter: QuickaddFilterType!) {
    quickadds(filter: $filter) {
      _id
      date_submitted
      url
      source_domain
    }
  }
`);

export const DELETE_QUICKADD = gql(`
  mutation DeleteOneQuickAdd($filter: QuickaddFilterType) {
    deleteManyQuickadds(filter: $filter) {
      deletedCount
    }
  }
`);

export const INSERT_QUICKADD = gql(`
  mutation InsertQuickAdd($data: QuickaddInsertType!) {
    insertOneQuickadd(data: $data) {
      _id
    }
  }
`);
