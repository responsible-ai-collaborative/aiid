import path from 'path';
import { MongoClient } from 'mongodb';
import { up as mergeSimilarEntitiesMigration } from '../../../migrations/2025.05.02T00.00.00.merge-similar-entities';
import { seedFixture } from '../utils';

const testCSVPath = path.resolve(__dirname, '..', 'data', 'test-merge.csv');

describe('Migration: merge-similar-entities', () => {

  let client: MongoClient;

  beforeAll(() => {
    client = new MongoClient(process.env.API_MONGODB_CONNECTION_STRING!);
  });

  afterAll(async () => {
    await client.close();
  });

  it('should read the CSV and merge entities as specified, leaving others untouched', async () => {

    await seedFixture({
      aiidprod: {
        entities: [
          { entity_id: 'primary-1', name: 'Primary One' },       // Will be kept
          { entity_id: 'secondary-1', name: 'Secondary One' },   // Will be merged into primary-1
          { entity_id: 'untouched-entity', name: 'Untouched' }  // Should not be affected by the migration
        ],
        incidents: [],
        reports: [],
      }
    });

    await mergeSimilarEntitiesMigration({ context: { client } }, testCSVPath);

    const db = client.db('aiidprod');
    const entitiesCollection = db.collection('entities');

    const primary1 = await entitiesCollection.findOne({ entity_id: 'primary-1' });
    expect(primary1).not.toBeNull();
    expect(primary1?.name).toBe('Primary One');

    const secondary1 = await entitiesCollection.findOne({ entity_id: 'secondary-1' });
    expect(secondary1).toBeNull();

    const untouched = await entitiesCollection.findOne({ entity_id: 'untouched-entity' });
    expect(untouched).not.toBeNull();
    expect(untouched?.name).toBe('Untouched');

  });
});
