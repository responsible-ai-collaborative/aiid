/**
 * Migration to merge entities based on a CSV of similar entity pairs.
 * It reads `migrations/data/similar_entities.csv`.
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */
const fs = require('fs');

const path = require('path');

const { parse } = require('csv-parse/sync');

exports.up = async ({ context: { client } }) => {
  console.log('Starting merge-similar-entities migration');
  const csvPath = path.resolve(__dirname, 'data', 'similar_entities.csv');

  if (!fs.existsSync(csvPath)) {
    console.log('No migrations/data/similar_entities.csv found, skipping migration');
    return;
  }
  const content = fs.readFileSync(csvPath, 'utf-8');

  const records = parse(content, { columns: true, skip_empty_lines: true, cast: true });

  const mergeModule = require('../server/shared/entities');

  let count = 0;

  for (const record of records) {
    const primaryId = record['Entity ID 1'];

    const secondaryId = record['Entity ID 2'];

    console.log(`Merging ${secondaryId} into ${primaryId}`);
    await mergeModule.mergeEntities(primaryId, secondaryId, client);
    count++;
  }

  console.log(`Completed merges for ${count} entity pairs`);
};
