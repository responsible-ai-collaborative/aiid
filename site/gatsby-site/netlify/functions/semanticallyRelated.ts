import { withSentry } from '../../sentry-instrumentation';
import * as Sentry from '@sentry/aws-serverless';
import { MongoClient } from 'mongodb';
import {
  createEmbeddingProvider,
  EmbeddingRequestError,
} from '../../src/utils/embeddings/provider';
import { loadIncidentVectors, rankIncidentVectors } from '../../src/utils/embeddings/vectors';

// Long reports are cut to the first chunk the nightly embedding run would make.
const MAX_INPUT_CHARS = 8000;
const EMBED_TIMEOUT_MS = 8000;

const respond = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

let client: MongoClient | undefined;

const handler = async function (event: { body?: string | null }) {
  let text: string;
  let num: number;
  try {
    const body = JSON.parse(event.body || '');
    text = typeof body.text === 'string' ? body.text.trim() : '';
    num = Number(body.num) > 0 ? Number(body.num) : 3;
  } catch {
    text = '';
    num = 0;
  }
  if (!text) return respond(400, { error: 'Text is required' });

  try {
    const provider = createEmbeddingProvider({ maxAttempts: 1, timeoutMs: EMBED_TIMEOUT_MS });
    const [vector] = (await provider.embed([text.slice(0, MAX_INPUT_CHARS)], 'query')).vectors;

    client ??= new MongoClient(process.env.API_MONGODB_CONNECTION_STRING!);
    const corpus = await loadIncidentVectors(
      client,
      provider.model,
      provider.profileId,
      vector.length
    );
    if (corpus.length === 0) throw new Error('No incident embeddings match the configured model');

    const incidents = rankIncidentVectors(corpus, vector, num).map(({ incident_id, score }) => ({
      incident_id,
      similarity: score,
    }));
    return respond(200, { incidents });
  } catch (error) {
    Sentry.captureException(error);
    const limited =
      error instanceof EmbeddingRequestError && (error.status === 429 || error.quotaExhausted);
    return respond(limited ? 429 : 503, {
      error: limited ? 'Similarity quota exhausted' : 'Similarity is unavailable',
    });
  }
};

module.exports = { handler: withSentry(handler) };
