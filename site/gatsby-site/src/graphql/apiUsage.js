import { gql } from '../../server/generated';

/**
 * Per-account API usage counters. Admin-only server-side.
 * SEE: server/apiUsage.ts, server/fields/apiUsage.ts
 */

/** Day-by-day counts, for looking at one account's traffic over time. */
export const FIND_API_USAGE = gql(`
  query FindApiUsage($filter: ApiUsageFilterType, $sort: ApiUsageSortType, $pagination: PaginationType) {
    apiUsages(filter: $filter, sort: $sort, pagination: $pagination) {
      _id
      userId
      date
      count
      errorCount
      deniedCount
      firstRequestAt
      lastRequestAt
    }
  }
`);

/** Totals per account, which is what the admin users table displays. */
export const FIND_API_USAGE_SUMMARIES = gql(`
  query FindApiUsageSummaries($userId: String, $from: String, $to: String) {
    apiUsageSummaries(userId: $userId, from: $from, to: $to) {
      userId
      count
      errorCount
      deniedCount
      activeDays
      firstRequestAt
      lastRequestAt
    }
  }
`);
