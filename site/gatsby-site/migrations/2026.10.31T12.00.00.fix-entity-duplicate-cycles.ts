import { MongoClient } from 'mongodb';

/**
 * Fixes cycles in specific entity duplicate pointers.
 *
 * Each pair has a row in both directions, for example:
 *
 *   { duplicate_entity_id: 'unknown-scammers', true_entity_id: 'scammers' }
 *   { duplicate_entity_id: 'scammers',         true_entity_id: 'unknown-scammers' }
 *
 * page-creators/createEntitiesPages.js publishes a redirect stub for every row,
 * after the real entity pages, and Gatsby's createPage overwrites by path, so
 * both entity pages were replaced by stubs naming each other as the real entity.
 *
 * Deleting the row that marks the survivor as a duplicate fixes the issue.
 */

const CYCLES: { survivor: string; duplicate: string }[] = [
  // 242 references
  { survivor: 'scammers', duplicate: 'unknown-scammers' },
  // 29 references
  {
    survivor: 'synthetic-video-generation-technology',
    duplicate: 'video-generation-technology',
  },
  // 29 references
  {
    survivor: 'synthetic-video-generation-technology-developers',
    duplicate: 'video-generation-technology-developers',
  },
];

export const up = async ({ context: { client } }: { context: { client: MongoClient } }) => {

  await client.connect();

  const db = client.db('aiidprod');
  const entities = db.collection('entities');
  const entityDuplicates = db.collection('entity_duplicates');

  // Sanity check that survivor entities actually exist.
  for (const { survivor, duplicate } of CYCLES) {

    if ((await entities.countDocuments({ entity_id: survivor })) === 0) {
      throw new Error(
        `"${survivor}" has no document in \`entities\` and cannot be the surviving entity. ` +
        `Maybe swap it with "${duplicate}" in this migration and re-run.`
      );
    }
  }

  for (const { survivor, duplicate } of CYCLES) {

    const { deletedCount } = await entityDuplicates.deleteMany({
      duplicate_entity_id: survivor,
      true_entity_id: duplicate,
    });

    console.log(
      `Deleted ${deletedCount} rows marking "${survivor}" as a duplicate. ` +
      `/entities/${survivor} now renders the entity and /entities/${duplicate} redirects to it.`
    );
  }
};

export const down = async () => {
  console.log('skipping restoring deleted duplicate entity redirects');
};
