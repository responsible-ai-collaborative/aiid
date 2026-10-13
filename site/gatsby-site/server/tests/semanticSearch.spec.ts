import { ApolloServer } from '@apollo/server';
import * as Sentry from '@sentry/aws-serverless';
import { Binary } from 'mongodb';
import { API_LOGIN_REQUIRED } from '../apiAccess';
import {
  normaliseBinaryVector,
  rankIncidentVectors,
  resetSemanticSearchCache,
} from '../fields/semanticSearch';
import {
  makeRequest,
  mockAnonymousSession,
  mockSession,
  seedCollection,
  startTestServer,
} from './utils';

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
    resetSemanticSearchCache();

    // The API requires a logged-in account (SEE: server/apiAccess.ts). A roleless
    // subscriber is enough, since the gate checks identity and not permission.
    await seedCollection({
      name: 'users',
      database: 'customData',
      docs: [{ userId: 'subscriber1', roles: ['subscriber'] }],
    });
    mockSession('subscriber1');

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

  it('requires a logged-in account and does not call the provider without one', async () => {
    global.fetch = jest.fn();
    mockAnonymousSession();

    const response = await execute('matching query');

    expect(response.body.errors[0]).toMatchObject({ extensions: { code: API_LOGIN_REQUIRED } });
    expect(global.fetch).not.toHaveBeenCalled();
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

  describe('every result, quickly', () => {
    /** Every text the embedding endpoint received, in order. */
    let embedded: string[];

    const stubEmbedding = (response: () => Promise<Response>) => {
      global.fetch = jest.fn(async (_url: unknown, init?: RequestInit) => {
        embedded.push(...JSON.parse(String(init?.body)).input);
        return response();
      }) as unknown as typeof fetch;
    };

    const embedAs = (values: number[]) =>
      stubEmbedding(
        async () =>
          new Response(JSON.stringify({ data: [{ index: 0, embedding: values }] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
      );

    const incident = (incident_id: number, reports: number[] = []) => ({
      incident_id,
      title: `Incident ${incident_id}`,
      description: 'Text',
      date: '2026-01-01',
      reports,
    });

    const vectors = (incident_id: number, values: number[]) => ({
      incident_id,
      embedding_schema_version: 2,
      embedding_profile: 'nemotron-retrieval-v1',
      model: 'nvidia/nemotron-3-embed-1b:free',
      dims: 2,
      overview: { vector: vector(values) },
      passages: [],
    });

    const search = (query: string, selection: string, limit?: number) =>
      makeRequest(url, {
        query: `
          query SemanticSearch($query: String!, $limit: Int) {
            semanticSearch(query: $query, limit: $limit) {
              status
              results { ${selection} }
            }
          }
        `,
        variables: { query, limit },
      });

    const resultIds = (response: any) =>
      response.body.data.semanticSearch.results.map((result: any) => result.incident.incident_id);

    beforeEach(() => {
      embedded = [];
    });

    it('returns every match when no limit is given, however many there are', async () => {
      const ids = Array.from({ length: 130 }, (_, index) => 100 + index);

      await seedCollection({ name: 'incidents', docs: ids.map((id) => incident(id)) });
      await seedCollection({
        name: 'incident_embeddings',
        docs: ids.map((id) => vectors(id, [1, 0])),
      });
      embedAs([1, 0]);

      expect(resultIds(await search('crashes', 'incident { incident_id }'))).toHaveLength(130);
      expect(resultIds(await search('crashes', 'incident { incident_id }', 2))).toHaveLength(2);
    });

    it('embeds a text once, whatever its case and spacing, and again only after a reset', async () => {
      embedAs([1, 0]);

      await search('Self-driving crashes', 'score');
      await search('self-driving   CRASHES', 'score');
      await search('self-driving crashes', 'score');

      expect(embedded).toEqual(['Self-driving crashes']);

      resetSemanticSearchCache();
      await search('self-driving crashes', 'score');

      expect(embedded).toEqual(['Self-driving crashes', 'self-driving crashes']);
    });

    it('does not keep a failed embedding, so the next search asks again', async () => {
      stubEmbedding(async () => new Response('unavailable', { status: 503 }));

      expect((await search('crashes', 'score')).body.data.semanticSearch.status).toBe(
        'UNAVAILABLE'
      );

      embedAs([1, 0]);

      expect((await search('crashes', 'score')).body.data.semanticSearch.status).toBe('OK');
      expect(embedded).toEqual(['crashes', 'crashes']);
    });

    it('gives each result the picture of its earliest report that has one', async () => {
      await seedCollection({
        name: 'incidents',
        docs: [incident(10, [202, 201, 203]), incident(11, [204]), incident(12, [205])],
      });
      await seedCollection({
        name: 'incident_embeddings',
        docs: [vectors(10, [1, 0]), vectors(11, [0.99, 0.14]), vectors(12, [0.95, 0.31])],
      });
      await seedCollection({
        name: 'reports',
        docs: [
          { report_number: 201, cloudinary_id: '', image_url: '' },
          {
            report_number: 202,
            cloudinary_id: 'reports/second.jpg',
            image_url: 'https://example.com/second.jpg',
          },
          { report_number: 203, cloudinary_id: 'reports/third.jpg', image_url: '' },
          { report_number: 204, image_url: 'https://example.com/link.jpg' },
          { report_number: 205, cloudinary_id: null, image_url: null },
        ],
      });
      embedAs([1, 0]);

      const response = await search(
        'crashes',
        'incident { incident_id } image { cloudinary_id image_url }'
      );

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.semanticSearch.results).toEqual([
        {
          incident: { incident_id: 10 },
          image: {
            cloudinary_id: 'reports/second.jpg',
            image_url: 'https://example.com/second.jpg',
          },
        },
        {
          incident: { incident_id: 11 },
          image: { cloudinary_id: null, image_url: 'https://example.com/link.jpg' },
        },
        { incident: { incident_id: 12 }, image: null },
      ]);
    });

    it("loads an incident's stored embedding when asked for it, also through a fragment", async () => {
      await seedCollection({
        name: 'incidents',
        docs: [{ ...incident(10), embedding: { vector: [0.5, 0.5] } }],
      });
      await seedCollection({ name: 'incident_embeddings', docs: [vectors(10, [1, 0])] });
      embedAs([1, 0]);

      const response = await makeRequest(url, {
        query: `
          query SemanticSearch($query: String!) {
            semanticSearch(query: $query) {
              results { incident { incident_id ...Stored } }
            }
          }

          fragment Stored on Incident {
            embedding { vector }
          }
        `,
        variables: { query: 'crashes' },
      });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.semanticSearch.results).toEqual([
        { incident: { incident_id: 10, embedding: { vector: [0.5, 0.5] } } },
      ]);
    });
  });
});
