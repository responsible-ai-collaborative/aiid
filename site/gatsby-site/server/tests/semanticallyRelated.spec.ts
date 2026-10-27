import { Binary, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { resetIncidentVectorCache } from '../../src/utils/embeddings/vectors';

jest.mock('../../sentry-instrumentation', () => ({ withSentry: (handler: unknown) => handler }));
jest.mock('@sentry/aws-serverless', () => ({ captureException: jest.fn() }));

const MODEL = 'nvidia/nemotron-3-embed-1b:free';

const binary = (values: number[]) => Binary.fromFloat32Array(Float32Array.from(values));

const row = (incident_id: number, overview: number[], passages: number[][], model = MODEL) => ({
  incident_id,
  embedding_schema_version: 2,
  embedding_profile: 'nemotron-retrieval-v1',
  model,
  dims: 2,
  overview: { vector: binary(overview) },
  passages: passages.map((vector) => ({ vector: binary(vector) })),
});

describe('/api/semanticallyRelated', () => {
  let mongo: MongoMemoryServer;
  let client: MongoClient;
  let handler: (event: { body: string }) => Promise<{ statusCode: number; body: string }>;
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    client = await new MongoClient(mongo.getUri()).connect();
    process.env = { ...originalEnv, API_MONGODB_CONNECTION_STRING: mongo.getUri() };
    ({ handler } = require('../../netlify/functions/semanticallyRelated'));

    await client
      .db('aiidprod')
      .collection('incident_embeddings')
      .insertMany([
        row(1, [1, 0], [[1, 0]]), // 1.00
        row(2, [0.6, 0.8], [[1, 0]]), // 0.65 × 0.6 + 0.35 × 1 = 0.74
        row(3, [0, 1], [[1, 0]]), // 0.35
        row(4, [0.8, 0.6], []), // no passages: 0.80
        row(5, [0, 1], [[0, 1]]), // 0, below the 0.15 minimum
        row(6, [1, 0], [], 'other-model'),
      ]);
  }, 60000);

  afterAll(async () => {
    await client?.close();
    await mongo?.stop();
    process.env = originalEnv;
  });

  beforeEach(() => {
    process.env.EMBEDDING_API_KEY = 'test-key';
    process.env.EMBEDDING_MODEL = MODEL;
    resetIncidentVectorCache();
    global.fetch = jest
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ data: [{ index: 0, embedding: [1, 0] }] }), { status: 200 })
      );
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  const invoke = async (body: unknown) => {
    const result = await handler({ body: typeof body === 'string' ? body : JSON.stringify(body) });
    return { status: result.statusCode, body: JSON.parse(result.body) };
  };

  it('returns the three closest incidents embedded by the same model', async () => {
    const result = await invoke({ text: 'A description' });

    expect(result.status).toBe(200);
    expect(result.body.incidents.map((incident: any) => incident.incident_id)).toEqual([1, 4, 2]);
    expect(result.body.incidents[2].similarity).toBeCloseTo(0.74);

    const request = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(request.input_type).toBe('query');
  });

  it('honours num and truncates long text to one request', async () => {
    const result = await invoke({ text: 'x'.repeat(20000), num: 5 });

    expect(result.body.incidents.map((incident: any) => incident.incident_id)).toEqual([
      1, 4, 2, 3,
    ]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body).input[0]).toHaveLength(
      8000
    );
  });

  it('rejects a missing text or malformed body', async () => {
    expect((await invoke({ text: '  ' })).status).toBe(400);
    expect((await invoke('not json')).status).toBe(400);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns 503 when no vectors match the configured model', async () => {
    process.env.EMBEDDING_MODEL = 'vendor/unused-model';

    expect((await invoke({ text: 'A description' })).status).toBe(503);
  });

  it('returns 429 when the provider quota is exhausted', async () => {
    global.fetch = jest.fn().mockResolvedValue(new Response('slow down', { status: 429 }));

    const result = await invoke({ text: 'A description' });

    expect(result.status).toBe(429);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
