import { MongoClient } from "mongodb";

const fs = require('fs');
const path = require('path');
const config = require('../config');


const relationshipsPath = path.join(__dirname, './data/oecd_relationships_2026_07_30.json');

export const up = async ({ context: { client } }: { context: { client: MongoClient } }) => {

  console.log('Starting OECD relationships import migration (2026-07-30 data)');

  const relationships = JSON.parse(fs.readFileSync(relationshipsPath, 'utf-8'));

  console.log(`Found ${relationships.length} relationships to import`);

  const relationshipsCollection = client.db(config.realm.production_db.db_name).collection('incident_links');

  let upserted = 0;

  for (const relationship of relationships) {
    try {

      // Upsert on the unique key (incident_id, sameAs, source_namespace) so
      // relationships imported by previous migrations are left untouched.
      const result = await relationshipsCollection.updateOne(
        {
          incident_id: relationship.incident_id,
          sameAs: relationship.sameAs,
          source_namespace: relationship.source_namespace,
        },
        { $setOnInsert: relationship },
        { upsert: true },
      );

      if (result.upsertedCount > 0) {
        upserted += 1;
      }
    }
    catch (error) {

      if (error instanceof Error) {
        console.error(`Error processing relationship for incident ${relationship.incident_id || 'unknown'}:`, error.message, JSON.stringify(relationship));
      } else {
        console.error('An unknown error occurred while processing a relationship:', JSON.stringify(relationship), error);
      }

      throw error;
    }
  }

  console.log(`OECD relationships import completed (2026-07-30 data): ${upserted} new relationships inserted, ${relationships.length - upserted} already present`);
};
