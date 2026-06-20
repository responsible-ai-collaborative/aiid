import { MongoClient } from "mongodb";

const config = require('../config');

/**
 * Removes duplicate rows from the `incident_links` collection.
 *
 * A row is considered a duplicate of another if it shares the same
 * (incident_id, sameAs, source_namespace) triple. For each duplicate set,
 * one row is kept and the rest are deleted.
 *
 * This cleans up duplicates introduced by past OECD import migrations
 * that re-inserted rows already present from prior imports.
 */
export const up = async ({ context: { client } }: { context: { client: MongoClient } }) => {

  console.log('Starting incident_links dedupe migration');

  const collection = client.db(config.realm.production_db.db_name).collection('incident_links');

  const duplicateGroups = await collection.aggregate([
    {
      $group: {
        _id: {
          incident_id: '$incident_id',
          sameAs: '$sameAs',
          source_namespace: '$source_namespace',
        },
        ids: { $push: '$_id' },
        count: { $sum: 1 },
      },
    },
    { $match: { count: { $gt: 1 } } },
  ]).toArray();

  console.log(`Found ${duplicateGroups.length} duplicate groups`);

  let totalDeleted = 0;

  for (const group of duplicateGroups) {
    const [, ...idsToDelete] = group.ids;

    const result = await collection.deleteMany({ _id: { $in: idsToDelete } });

    totalDeleted += result.deletedCount ?? 0;
  }

  console.log(`Deleted ${totalDeleted} duplicate incident_links rows`);
};
