import { Binary, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

const binary = (values: number[]) => Binary.fromFloat32Array(Float32Array.from(values));

const row = (incident_id: number, vector: number[]) => ({
  incident_id,
  embedding_schema_version: 2,
  dims: vector.length,
  overview: { vector: binary(vector) },
});

describe('updateTsneInDatabase', () => {
  let mongo: MongoMemoryServer;
  let client: MongoClient;
  const originalEnv = process.env;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    client = await new MongoClient(mongo.getUri()).connect();
  }, 60000);

  afterAll(async () => {
    await client?.close();
    await mongo?.stop();
    process.env = originalEnv;
  });

  it('writes positions from the overview vectors of current incidents', async () => {
    const db = client.db('aiidprod');

    await db
      .collection('incidents')
      .insertMany([1, 2, 3, 4, 5].map((incident_id) => ({ incident_id })));
    await db.collection('incident_embeddings').insertMany([
      row(1, [1, 0, 0]),
      row(2, [0.9, 0.1, 0]),
      row(3, [0, 1, 0]),
      row(4, [0, 0.9, 0.1]),
      row(5, [5, 5]), // a different vector size, left for the next run
      row(6, [0, 0, 1]), // deleted incident
    ]);

    process.env = {
      ...originalEnv,
      MONGODB_TRANSLATIONS_CONNECTION_STRING: mongo.getUri(),
      TSNE_NITER: '50',
    };

    await jest.isolateModulesAsync(async () => {
      await require('../../src/utils/updateTsne').updateTsneInDatabase();
    });

    const incidents = await db
      .collection('incidents')
      .find({}, { sort: { incident_id: 1 } })
      .toArray();

    for (const incident of incidents.slice(0, 4)) {
      expect(Math.abs(incident.tsne.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(incident.tsne.y)).toBeLessThanOrEqual(1);
    }
    expect(incidents[4].tsne).toBeUndefined();
    expect(await db.collection('incidents').countDocuments({ incident_id: 6 })).toBe(0);
  });
});
