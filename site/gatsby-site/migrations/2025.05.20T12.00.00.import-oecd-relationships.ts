import { MongoClient } from "mongodb";

const fs = require('fs');
const path = require('path');
const config = require('../config');


const relationshipsPath = path.join(__dirname, './data/oecd_relationships.json');

export const up = async ({ context: { client } }: { context: { client: MongoClient } }) => {

  console.log('Starting OECD relationships import migration');

  const relationships = JSON.parse(fs.readFileSync(relationshipsPath, 'utf-8'));

  console.log(`Found ${relationships.length} relationships to import`);

  const relationshipsCollection = client.db(config.realm.production_db.db_name).collection('incident_links');

  for (const relationship of relationships) {
    try {

      await relationshipsCollection.insertOne(relationship);
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

  console.log('OECD relationships import completed');
};