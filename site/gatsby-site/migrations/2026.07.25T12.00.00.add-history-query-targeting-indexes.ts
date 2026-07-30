import { MongoClient } from "mongodb";

const config = require('../config');

/**
 * Adds the indexes backing the two version-history queries, which are the
 * remaining source of the "Query Targeting: Scanned Objects / Returned has
 * gone above 1000" Atlas alert.
 *
 * The `history` database has never had an index created on it: it is written
 * append-only by `logIncidentHistory` / `logReportHistory` (an `insertOne` on
 * every incident and report edit), so it grows without bound while the only
 * reads against it are single-entity lookups:
 *
 *   history.reports    { report_number: N } sort { date_modified: -1 }
 *                      <- FIND_REPORT_HISTORY, /cite/history?report_number=N
 *   history.incidents  { incident_id: N }   sort { date_modified: -1 }
 *                      <- FIND_INCIDENT_HISTORY, /incidents/history?incident_id=N
 *
 * Each returns only the handful of versions belonging to one entity, so every
 * request was a COLLSCAN of the whole collection plus a blocking in-memory
 * SORT. Measured against the 2026-07-20 snapshot the ratios were 10,697:1
 * (history.reports) and 1,002:1 (history.incidents); both drop to 1:1 with
 * these indexes.
 *
 * The keys are compound and ordered (equality field, then sort field) so the
 * index satisfies the filter and the `date_modified` sort together, which also
 * removes the blocking sort stage. `background: true` lets Atlas build them
 * without blocking writes on the primary.
 */
export const up = async ({ context: { client } }: { context: { client: MongoClient } }) => {

  const historyDb = client.db(config.realm.production_db.db_history_name);

  await historyDb.collection('reports').createIndex(
    { report_number: 1, date_modified: -1 },
    { name: 'report_number_date_modified_idx', background: true },
  );

  await historyDb.collection('incidents').createIndex(
    { incident_id: 1, date_modified: -1 },
    { name: 'incident_id_date_modified_idx', background: true },
  );

  console.log('Created query-targeting indexes on the history database');
};

export const down = async ({ context: { client } }: { context: { client: MongoClient } }) => {

  const historyDb = client.db(config.realm.production_db.db_history_name);

  const drops: Array<[string, string]> = [
    ['reports', 'report_number_date_modified_idx'],
    ['incidents', 'incident_id_date_modified_idx'],
  ];

  for (const [collectionName, indexName] of drops) {
    try {
      await historyDb.collection(collectionName).dropIndex(indexName);
    } catch (e: any) {
      console.log(`Could not drop ${indexName}: ${e.message}`);
    }
  }
};
