import {
  buildIncidentOverview,
  chunkTextWithOffsets,
  getReportBody,
  sortReports,
} from '../../src/utils/embeddings/incidentText';
import {
  createEmbeddingProvider,
  resolveEmbeddingProfile,
} from '../../src/utils/embeddings/provider';

describe('incident embedding inputs', () => {
  it('builds the overview from existing title and description fields', () => {
    expect(
      buildIncidentOverview({ title: ' Deepfake case ', description: ' Synthetic video ' })
    ).toBe('Title: Deepfake case\n\nDescription: Synthetic video');
  });

  it('chunks report text with bounded size, overlap, and source offsets', () => {
    const text =
      'First paragraph has useful context.\n\nSecond paragraph continues the incident.\n\nThird paragraph closes it.';
    const chunks = chunkTextWithOffsets(text, 55, 10);

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.text.length <= 55)).toBe(true);
    expect(chunks.every((chunk) => text.slice(chunk.startChar, chunk.endChar) === chunk.text)).toBe(
      true
    );
    expect(chunks[1].startChar).toBeLessThan(chunks[0].endChar);
  });

  it('uses plain_text first and sorts reports deterministically', () => {
    const reports = [
      { report_number: 9, text: 'nine' },
      { report_number: 2, plain_text: ' preferred ', text: 'fallback' },
    ];

    expect(sortReports(reports).map((report) => report.report_number)).toEqual([2, 9]);
    expect(getReportBody(reports[1])).toBe('preferred');
  });
});

describe('embedding provider profiles and validation', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      EMBEDDING_API_KEY: 'test-key',
      EMBEDDING_API_BASE_URL: 'https://embedding.test/v1',
      EMBEDDING_MAX_ATTEMPTS: '1',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
  });

  it('adds input_type only for the Nemotron profile', async () => {
    process.env.EMBEDDING_MODEL = 'nvidia/nemotron-3-embed-1b:free';
    const fetchMock = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: [{ index: 0, embedding: [0.1, 0.2] }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    global.fetch = fetchMock;

    await createEmbeddingProvider().embed(['document'], 'document');

    const request = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(request).toEqual({
      model: 'nvidia/nemotron-3-embed-1b:free',
      input: ['document'],
      input_type: 'passage',
    });
  });

  it('keeps the generic request portable for an unknown model', async () => {
    process.env.EMBEDDING_MODEL = 'vendor/new-model';
    const fetchMock = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: [{ index: 0, embedding: [0.1, 0.2] }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    global.fetch = fetchMock;

    await createEmbeddingProvider().embed(['query'], 'query');

    const request = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(request).toEqual({ model: 'vendor/new-model', input: ['query'] });
    expect(resolveEmbeddingProfile('vendor/new-model').id).toBe('openai-compatible-v1');
  });

  it('rejects duplicate response indices', async () => {
    process.env.EMBEDDING_MODEL = 'vendor/new-model';
    global.fetch = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            { index: 0, embedding: [0.1, 0.2] },
            { index: 0, embedding: [0.3, null] },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );

    await expect(createEmbeddingProvider().embed(['one', 'two'])).rejects.toThrow(
      'invalid or duplicate embedding index'
    );
  });

  it('rejects non-finite vector values', async () => {
    process.env.EMBEDDING_MODEL = 'vendor/new-model';
    global.fetch = jest
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ data: [{ index: 0, embedding: [0.1, null] }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

    await expect(createEmbeddingProvider().embed(['one'])).rejects.toThrow(
      'empty or contains non-numbers'
    );
  });
});
