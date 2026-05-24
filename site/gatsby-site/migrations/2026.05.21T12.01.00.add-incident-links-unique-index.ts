import { MongoClient } from "mongodb";

const config = require('../config');

/**
 * Adds a unique index on (incident_id, sameAs, source_namespace) for the
 * `incident_links` collection so that future imports cannot re-insert a
 * relationship that is already present.
 *
 * Run after the dedupe migration; creating a unique index will fail if
 * duplicates remain.
 */
export const up = async ({ context: { client } }: { context: { client: MongoClient } }) => {

  const collection = client.db(config.realm.production_db.db_name).collection('incident_links');

  await collection.createIndex(
    { incident_id: 1, sameAs: 1, source_namespace: 1 },
    { unique: true, name: 'incident_links_unique_link' },
  );

  console.log('Created unique index incident_links_unique_link on incident_links');
};
