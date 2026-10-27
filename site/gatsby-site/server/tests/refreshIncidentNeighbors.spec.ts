import { Binary, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { refreshIncidentNeighbors } from '../../src/scripts/refresh-incident-neighbors';
import { resetIncidentVectorCache } from '../../src/utils/embeddings/vectors';

const MODEL = 'nvidia/nemotron-3-embed-1b:free';

const row = (incident_id: number, overview: number[]) => ({
  incident_id,
  embedding_schema_version: 2,
  embedding_profile: 'nemotron-retrieval-v1',
  model: MODEL,
  dims: 2,
  overview: { vector: Binary.fromFloat32Array(Float32Array.from(overview)) },
  passages: [],
});

describe('refreshIncidentNeighbors', () => {
  let mongo: MongoMemoryServer;
  let client: MongoClient;
  const originalEnv = process.env;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    client = await new MongoClient(mongo.getUri()).connect();
    process.env = { ...originalEnv, EMBEDDING_API_KEY: 'test-key', EMBEDDING_MODEL: MODEL };
  }, 60000);

  afterAll(async () => {
    await client?.close();
    await mongo?.stop();
    process.env = originalEnv;
  });

  beforeEach(async () => {
    resetIncidentVectorCache();
    const db = client.db('aiidprod');
    await db.collection('incidents').deleteMany({});
    await db.collection('incident_embeddings').deleteMany({});
    await db
      .collection('incidents')
      .insertMany([
        { incident_id: 1, nlp_similar_incidents: [] },
        { incident_id: 2 },
        { incident_id: 3 },
        { incident_id: 4, nlp_similar_incidents: [{ incident_id: 1, similarity: 0.9 }] },
      ]);
    await db
      .collection('incident_embeddings')
      .insertMany([row(1, [1, 0]), row(2, [0.8, 0.6]), row(3, [0.6, 0.8]), row(5, [1, 0])]);
  });

  const stored = async (incident_id: number) =>
    (await client.db('aiidprod').collection('incidents').findOne({ incident_id }))
      ?.nlp_similar_incidents;

  it('stores the closest other incidents and keeps lists of incidents not yet embedded', async () => {
    const summary = await refreshIncidentNeighbors(client);

    expect(summary).toMatchObject({ incidents: 4, embedded: 3, changed: 3 });
    // Incident 5 has a vector but no longer exists, so it is never suggested.
    expect((await stored(1)).map((neighbor: any) => neighbor.incident_id)).toEqual([2, 3]);
    expect((await stored(1))[0].similarity).toBeCloseTo(0.8);
    expect(await stored(4)).toEqual([{ incident_id: 1, similarity: 0.9 }]);
  });

  it('writes nothing in a dry run', async () => {
    const summary = await refreshIncidentNeighbors(client, { dryRun: true });

    expect(summary.changed).toBe(3);
    expect(await stored(1)).toEqual([]);
  });
});
