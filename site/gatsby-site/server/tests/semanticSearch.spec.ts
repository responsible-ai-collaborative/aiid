import { ApolloServer } from '@apollo/server';
import * as Sentry from '@sentry/aws-serverless';
import { Binary } from 'mongodb';
import {
  normaliseBinaryVector,
  rankIncidentVectors,
  resetSemanticSearchCache,
} from '../fields/semanticSearch';
import { makeRequest, seedCollection, startTestServer } from './utils';

jest.mock('@sentry/aws-serverless', () => ({ captureException: jest.fn() }));

const vector = (values: number[]) => Binary.fromFloat32Array(Float32Array.from(values));

describe('semantic search vector helpers', () => {
  it('decodes and normalises Float32 BSON vectors', () => {
    const normalised = normaliseBinaryVector(vector([3, 4]), 2);

    expect(Array.from(normalised || [])).toEqual([0.6000000238418579, 0.800000011920929]);
    expect(normaliseBinaryVector(vector([0, 0]), 2)).toBeNull();
    expect(normaliseBinaryVector(vector([1, 2]), 3)).toBeNull();
  });

  it('weights overview and best-passage similarity and applies ordering, threshold, and limit', () => {
    const incidents = [
      {
        incidentId: 1,
        overview: Float32Array.from([1, 0]),
        passages: [Float32Array.from([0, 1])],
      },
      {
        incidentId: 2,
        overview: Float32Array.from([0.6, 0.8]),
        passages: [Float32Array.from([1, 0]), Float32Array.from([0, 1])],
      },
      {
        incidentId: 3,
        overview: Float32Array.from([-1, 0]),
        passages: [],
      },
    ];

    const results = rankIncidentVectors(incidents, [1, 0], 1, 0.15);

    expect(results).toHaveLength(1);
    expect(results[0].incident_id).toBe(2);
    expect(results[0].score).toBeCloseTo(0.74);
  });

  it('uses the overview score when an incident has no passage vectors', () => {
    const results = rankIncidentVectors(
      [{ incidentId: 7, overview: Float32Array.from([1, 0]), passages: [] }],
      [2, 0],
      10
    );

    expect(results[0]).toMatchObject({ incident_id: 7, score: 1 });
  });
});

describe('semanticSearch GraphQL field', () => {
  let server: ApolloServer;
  let url: string;
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeAll(async () => {
    ({ server, url } = await startTestServer());
  });

  afterAll(async () => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    await server.stop();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      EMBEDDING_API_KEY: 'test-key',
      EMBEDDING_API_BASE_URL: 'https://embedding.test/v1',
      EMBEDDING_MODEL: 'nvidia/nemotron-3-embed-1b:free',
    };
    delete process.env.NVIDIA_URL;
    delete process.env.NVIDIA_API_KEY;
    resetSemanticSearchCache();

    await seedCollection({
      name: 'incidents',
      docs: [
        { incident_id: 1, title: 'Overview match', description: 'First', date: '2026-01-01' },
        { incident_id: 2, title: 'Passage match', description: 'Second', date: '2026-01-02' },
        { incident_id: 3, title: 'Legacy row', description: 'Ignored', date: '2026-01-03' },
        { incident_id: 4, title: 'New cache key', description: 'Third', date: '2026-01-04' },
      ],
    });
    await seedCollection({
      name: 'incident_embeddings',
      docs: [
        {
          incident_id: 1,
          embedding_schema_version: 2,
          embedding_profile: 'nemotron-retrieval-v1',
          model: 'nvidia/nemotron-3-embed-1b:free',
          dims: 2,
          overview: { vector: vector([1, 0]) },
          passages: [{ vector: vector([0, 1]) }],
        },
        {
          incident_id: 2,
          embedding_schema_version: 2,
          embedding_profile: 'nemotron-retrieval-v1',
          model: 'nvidia/nemotron-3-embed-1b:free',
          dims: 2,
          overview: { vector: vector([0, 1]) },
          passages: [{ vector: vector([1, 0]) }],
        },
        {
          incident_id: 3,
          embedding_schema_version: 1,
          embedding_profile: 'nemotron-retrieval-v1',
          model: 'nvidia/nemotron-3-embed-1b:free',
          dims: 2,
          overview: { vector: vector([1, 0]) },
          passages: [],
        },
        {
          incident_id: 3,
          embedding_schema_version: 2,
          embedding_profile: 'openai-compatible-v1',
          model: 'nvidia/nemotron-3-embed-1b:free',
          dims: 2,
          overview: { vector: vector([1, 0]) },
          passages: [],
        },
        {
          incident_id: 3,
          embedding_schema_version: 2,
          embedding_profile: 'nemotron-retrieval-v1',
          model: 'vendor/other-model',
          dims: 2,
          overview: { vector: vector([1, 0]) },
          passages: [],
        },
        {
          incident_id: 3,
          embedding_schema_version: 2,
          embedding_profile: 'nemotron-retrieval-v1',
          model: 'nvidia/nemotron-3-embed-1b:free',
          dims: 3,
          overview: { vector: vector([1, 0, 0]) },
          passages: [],
        },
      ],
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  const execute = (query: string) =>
    makeRequest(url, {
      query: `
        query SemanticSearch($query: String!) {
          semanticSearch(query: $query) {
            status
            results { score incident { incident_id title } }
          }
        }
      `,
      variables: { query },
    });

  it('returns ranked schema-v2 incidents and ignores legacy embedding documents', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: [{ index: 0, embedding: [1, 0] }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const response = await execute('matching query');

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.semanticSearch.status).toBe('OK');
    expect(
      response.body.data.semanticSearch.results.map((result: any) => result.incident.incident_id)
    ).toEqual([1, 2]);
  });

  it('does not call the provider for an empty query', async () => {
    global.fetch = jest.fn();

    const response = await execute('   ');

    expect(response.body.data.semanticSearch).toEqual({ status: 'OK', results: [] });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('maps provider quota exhaustion to QUOTA_EXHAUSTED', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(
        new Response('rate limited', { status: 429, headers: { 'Retry-After': '120' } })
      );

    const response = await execute('query');

    expect(response.body.data.semanticSearch).toEqual({
      status: 'QUOTA_EXHAUSTED',
      results: [],
    });
  });

  it('maps provider failures to UNAVAILABLE and reports them to Sentry', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('provider unavailable'));

    const response = await execute('query');

    expect(response.body.data.semanticSearch).toEqual({ status: 'UNAVAILABLE', results: [] });
    expect(Sentry.captureException).toHaveBeenCalled();
  });

  it('returns UNAVAILABLE when no current embeddings exist', async () => {
    await seedCollection({ name: 'incident_embeddings', docs: [] });
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: [{ index: 0, embedding: [1, 0] }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const response = await execute('query');

    expect(response.body.data.semanticSearch).toEqual({ status: 'UNAVAILABLE', results: [] });
  });

  it('reloads vectors when the embedding dimensions change', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [{ index: 0, embedding: [1, 0] }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const firstResponse = await execute('two dimensions');

    expect(firstResponse.body.data.semanticSearch.results[0].incident.incident_id).toBe(1);

    await seedCollection({
      name: 'incident_embeddings',
      docs: [
        {
          incident_id: 4,
          embedding_schema_version: 2,
          embedding_profile: 'nemotron-retrieval-v1',
          model: 'nvidia/nemotron-3-embed-1b:free',
          dims: 3,
          overview: { vector: vector([1, 0, 0]) },
          passages: [],
        },
      ],
    });
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [{ index: 0, embedding: [1, 0, 0] }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const response = await execute('three dimensions');

    expect(response.body.data.semanticSearch.status).toBe('OK');
    expect(response.body.data.semanticSearch.results).toHaveLength(1);
    expect(response.body.data.semanticSearch.results[0].incident.incident_id).toBe(4);
  });
});
