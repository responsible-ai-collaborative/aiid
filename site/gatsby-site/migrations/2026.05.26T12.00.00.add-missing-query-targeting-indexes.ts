import { MongoClient } from "mongodb";

const config = require('../config');

/**
 * Adds indexes to back the query patterns most responsible for the
 * "Scanned Objects / Returned > 1000" Atlas alert.
 *
 * Each index is named so it can be reversed in `down`. `background: true`
 * lets Atlas build them without blocking writes on the primary.
 */
export const up = async ({ context: { client } }: { context: { client: MongoClient } }) => {

  const prodDb = client.db(config.realm.production_db.db_name);
  const customDataDb = client.db(config.realm.production_db.db_custom_data);
  const translationsDb = client.db('translations');

  // translations.reports: per-page resolver scans the whole collection because
  // the Dec 2024 refactor merged reports_en/es/fr/ja without re-creating the
  // report_number index on the new combined collection.
  await translationsDb.collection('reports').createIndex(
    { report_number: 1, language: 1 },
    { name: 'report_number_language_idx', background: true },
  );

  // classifications: incident pages resolve `classifications` by scanning
  // for the incident_id in the `incidents` array field.
  await prodDb.collection('classifications').createIndex(
    { incidents: 1 },
    { name: 'incidents_idx', background: true },
  );

  // incidents.reports: every report link/unlink mutation and the
  // incidentsByReportNumbers query filter by `reports: { $in: [...] }`.
  await prodDb.collection('incidents').createIndex(
    { reports: 1 },
    { name: 'reports_idx', background: true },
  );

  // incidents.date_modified: weekly briefing job does a range scan on
  // date_modified to find updated incidents.
  await prodDb.collection('incidents').createIndex(
    { date_modified: -1 },
    { name: 'date_modified_idx', background: true },
  );

  // notifications: process-notifications.ts runs four
  // { processed: false, type: ... } queries every cron tick.
  await customDataDb.collection('notifications').createIndex(
    { processed: 1, type: 1 },
    { name: 'processed_type_idx', background: true },
  );

  // subscriptions: looked up by type alone and by type + (incident_id|entityId)
  // every notification cycle; also by userId from the user settings page.
  await customDataDb.collection('subscriptions').createIndex(
    { type: 1, incident_id: 1 },
    { name: 'type_incident_id_idx', background: true },
  );
  await customDataDb.collection('subscriptions').createIndex(
    { type: 1, entityId: 1 },
    { name: 'type_entityId_idx', background: true },
  );
  await customDataDb.collection('subscriptions').createIndex(
    { userId: 1 },
    { name: 'userId_idx', background: true },
  );

  // entity_relationships: merge and lookup paths use
  // { $or: [{ sub }, { obj }] }. Two single-field indexes let the planner
  // index-union them.
  await prodDb.collection('entity_relationships').createIndex(
    { sub: 1 },
    { name: 'sub_idx', background: true },
  );
  await prodDb.collection('entity_relationships').createIndex(
    { obj: 1 },
    { name: 'obj_idx', background: true },
  );

  console.log('Created query-targeting indexes');
};

export const down = async ({ context: { client } }: { context: { client: MongoClient } }) => {

  const prodDb = client.db(config.realm.production_db.db_name);
  const customDataDb = client.db(config.realm.production_db.db_custom_data);
  const translationsDb = client.db('translations');

  const drops: Array<[ReturnType<typeof prodDb.collection>, string]> = [
    [translationsDb.collection('reports'), 'report_number_language_idx'],
    [prodDb.collection('classifications'), 'incidents_idx'],
    [prodDb.collection('incidents'), 'reports_idx'],
    [prodDb.collection('incidents'), 'date_modified_idx'],
    [customDataDb.collection('notifications'), 'processed_type_idx'],
    [customDataDb.collection('subscriptions'), 'type_incident_id_idx'],
    [customDataDb.collection('subscriptions'), 'type_entityId_idx'],
    [customDataDb.collection('subscriptions'), 'userId_idx'],
    [prodDb.collection('entity_relationships'), 'sub_idx'],
    [prodDb.collection('entity_relationships'), 'obj_idx'],
  ];

  for (const [collection, indexName] of drops) {
    try {
      await collection.dropIndex(indexName);
    } catch (e: any) {
      console.log(`Could not drop ${indexName}: ${e.message}`);
    }
  }
};
