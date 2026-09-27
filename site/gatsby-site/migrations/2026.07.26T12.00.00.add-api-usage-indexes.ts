import { MongoClient } from "mongodb";

const config = require('../config');

/**
 * Creates the indexes backing the per-account API usage counters.
 * SEE: server/apiUsage.ts
 *
 * `customData.api_usage` holds one document per (account, UTC day) and is written
 * by an upsert on the (`userId`, `date`) pair on *every* API request. That upsert
 * is the hottest write in the API, so the pair needs an index or each request
 * would collection-scan to find its own bucket — and the collection grows
 * fastest exactly when traffic is heaviest, which is the situation this feature
 * exists to measure. The index is unique so that concurrent requests from the
 * same account on the same day cannot race into two buckets for that day: with a
 * unique index one upsert wins and the other retries into it.
 *
 * The second index serves the date-range scans of `apiUsageSummaries`, which
 * aggregates by `date` across all accounts.
 */
export const up = async ({ context: { client } }: { context: { client: MongoClient } }) => {

  const customData = client.db(config.realm.production_db.db_custom_data);

  await customData.collection('api_usage').createIndex(
    { userId: 1, date: 1 },
    { name: 'api_usage_user_day_unique', unique: true, background: true },
  );

  await customData.collection('api_usage').createIndex(
    { date: 1 },
    { name: 'api_usage_date_idx', background: true },
  );
};

export const down = async ({ context: { client } }: { context: { client: MongoClient } }) => {

  const collection = client.db(config.realm.production_db.db_custom_data).collection('api_usage');

  await collection.dropIndex('api_usage_user_day_unique');
  await collection.dropIndex('api_usage_date_idx');
};
