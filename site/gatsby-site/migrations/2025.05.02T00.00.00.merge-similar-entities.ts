import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { MongoClient } from 'mongodb';
import { mergeEntities } from '../server/shared/entities';
export const up = async ({ context: { client } }: { context: { client: MongoClient } }) => {

  console.log('Starting merge-similar-entities migration');

  const csvPath = path.resolve(__dirname, 'data', 'similar_entities.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true, cast: true });

  let count = 0;

  for (const record of records) {

    const primaryId = record['Entity ID 1'];
    const secondaryId = record['Entity ID 2'];
    const keepId = record['Keep (1 or 2)'];

    console.log(`Merging ${secondaryId} into ${primaryId}`);
    
    await mergeEntities(primaryId, secondaryId, keepId, client);

    count++;
  }

  console.log(`Completed merges for ${count} entity pairs`);
};
