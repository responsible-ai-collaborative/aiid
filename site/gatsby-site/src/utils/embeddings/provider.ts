/** OpenAI-compatible embedding client with small, model-specific request profiles. */

export interface EmbedResult {
  vectors: number[][];
  attempts: number;
  latencyMs: number;
}

export type EmbeddingPurpose = 'document' | 'query';

export interface EmbeddingProvider {
  model: string;
  baseUrl: string;
  profileId: string;
  timeoutMs: number;
  maxAttempts: number;
  embed: (texts: string[], purpose?: EmbeddingPurpose) => Promise<EmbedResult>;
}

export class EmbeddingRequestError extends Error {
  status: number | null;
  attempts: number;
  body: string;
  quotaExhausted: boolean;

  constructor(
    message: string,
    {
      status,
      attempts,
      body,
      quotaExhausted = false,
    }: { status: number | null; attempts: number; body: string; quotaExhausted?: boolean }
  ) {
    super(message);
    this.name = 'EmbeddingRequestError';
    this.status = status;
    this.attempts = attempts;
    this.body = body;
    this.quotaExhausted = quotaExhausted;
  }
}

type EmbeddingProfile = {
  id: string;
  requestOptions: (purpose: EmbeddingPurpose) => Record<string, string>;
};

/** Unknown models use the portable OpenAI request shape with no vendor-only fields. */
export const resolveEmbeddingProfile = (model: string): EmbeddingProfile => {
  if (/(^|\/)nemotron-[^/]*embed/i.test(model)) {
    return {
      id: 'nemotron-retrieval-v1',
      requestOptions: (purpose) => ({ input_type: purpose === 'query' ? 'query' : 'passage' }),
    };
  }

  return { id: 'openai-compatible-v1', requestOptions: () => ({}) };
};

const RETRYABLE_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);
const BASE_BACKOFF_MS = 2000;
const MAX_BACKOFF_MS = 60_000;
const MAX_RETRY_AFTER_MS = MAX_BACKOFF_MS;

const positiveInteger = (value: string | undefined, fallback: number): number => {
  if (value === undefined || value.trim() === '') return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`expected a positive integer, got ${JSON.stringify(value)}`);
  }

  return parsed;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const seconds = (ms: number) => `${Math.round(ms / 1000)}s`;

const backoffDelay = (attempt: number): number => {
  const base = Math.min(BASE_BACKOFF_MS * Math.pow(2, attempt - 1), MAX_BACKOFF_MS);
  return Math.round(base * (0.8 + Math.random() * 0.4));
};

const parseRetryAfter = (value: string | null): number | null => {
  if (value === null || value.trim() === '') return null;

  const deltaSeconds = Number(value);
  if (Number.isFinite(deltaSeconds)) return Math.max(0, deltaSeconds * 1000);

  const date = Date.parse(value);
  return Number.isNaN(date) ? null : Math.max(0, date - Date.now());
};

const validateVectors = (data: unknown, expectedCount: number): number[][] => {
  if (!Array.isArray(data) || data.length !== expectedCount) {
    throw new Error(
      `unexpected response: expected ${expectedCount} embeddings, got ${
        Array.isArray(data) ? data.length : typeof data
      }`
    );
  }

  const ordered = new Array<number[]>(expectedCount);

  for (const entry of data) {
    const index = (entry as any)?.index;
    const vector = (entry as any)?.embedding;

    if (!Number.isInteger(index) || index < 0 || index >= expectedCount || ordered[index]) {
      throw new Error(`unexpected response: invalid or duplicate embedding index ${index}`);
    }

    if (!Array.isArray(vector) || vector.length === 0 || vector.some((x) => !Number.isFinite(x))) {
      throw new Error(`unexpected response: embedding ${index} is empty or contains non-numbers`);
    }

    ordered[index] = vector;
  }

  const dimensions = ordered[0]?.length;
  if (!dimensions || ordered.some((vector) => vector.length !== dimensions)) {
    throw new Error('unexpected response: embeddings have differing dimensions');
  }

  return ordered;
};

export const createEmbeddingProvider = (): EmbeddingProvider => {
  const baseUrl = (process.env.EMBEDDING_API_BASE_URL || 'https://openrouter.ai/api/v1').replace(
    /\/+$/,
    ''
  );
  const model = process.env.EMBEDDING_MODEL || 'nvidia/nemotron-3-embed-1b:free';
  const apiKey = process.env.EMBEDDING_API_KEY;

  if (!apiKey) throw new Error('EMBEDDING_API_KEY is required.');

  const timeoutMs = positiveInteger(process.env.EMBEDDING_TIMEOUT_MS, 120_000);
  const maxAttempts = positiveInteger(process.env.EMBEDDING_MAX_ATTEMPTS, 6);
  const profile = resolveEmbeddingProfile(model);

  const embed = async (
    texts: string[],
    purpose: EmbeddingPurpose = 'document'
  ): Promise<EmbedResult> => {
    if (texts.length === 0) throw new Error('cannot embed an empty input batch');

    let lastStatus: number | null = null;
    let lastBody = '';
    let lastMessage = 'unknown error';

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const startedAt = Date.now();

      try {
        const response = await fetch(`${baseUrl}/embeddings`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ model, input: texts, ...profile.requestOptions(purpose) }),
          signal: controller.signal,
        });
        const latencyMs = Date.now() - startedAt;

        if (response.ok) {
          const json: any = await response.json();
          return {
            vectors: validateVectors(json?.data, texts.length),
            attempts: attempt,
            latencyMs,
          };
        }

        lastStatus = response.status;
        lastBody = (await response.text().catch(() => '')).slice(0, 500);
        lastMessage = `HTTP ${response.status}`;

        if (!RETRYABLE_STATUSES.has(response.status)) {
          throw new EmbeddingRequestError(`non-retryable ${lastMessage}: ${lastBody}`, {
            status: lastStatus,
            attempts: attempt,
            body: lastBody,
          });
        }

        const retryAfter = parseRetryAfter(response.headers.get('retry-after'));
        if (retryAfter !== null && retryAfter > MAX_RETRY_AFTER_MS) {
          throw new EmbeddingRequestError(
            `quota exhausted: server asked for Retry-After ${seconds(retryAfter)}, ` +
              `above the ${seconds(MAX_RETRY_AFTER_MS)} ceiling`,
            { status: lastStatus, attempts: attempt, body: lastBody, quotaExhausted: true }
          );
        }

        if (attempt < maxAttempts) {
          const waitMs = retryAfter ?? backoffDelay(attempt);
          console.warn(
            `attempt ${attempt}/${maxAttempts} status=${response.status}` +
              `${retryAfter === null ? '' : ` retry_after=${seconds(retryAfter)}`}` +
              ` waiting ${seconds(waitMs)}`
          );
          await sleep(waitMs);
        }
      } catch (e: any) {
        if (e instanceof EmbeddingRequestError) throw e;

        lastMessage =
          e?.name === 'AbortError'
            ? `timeout after ${seconds(timeoutMs)}`
            : e?.message || String(e);

        if (attempt < maxAttempts) {
          const waitMs = backoffDelay(attempt);
          console.warn(
            `attempt ${attempt}/${maxAttempts} ${lastMessage} waiting ${seconds(waitMs)}`
          );
          await sleep(waitMs);
        }
      } finally {
        clearTimeout(timer);
      }
    }

    throw new EmbeddingRequestError(
      `gave up after ${maxAttempts} attempts: ${lastMessage}${lastBody ? `: ${lastBody}` : ''}`,
      { status: lastStatus, attempts: maxAttempts, body: lastBody }
    );
  };

  return { model, baseUrl, profileId: profile.id, timeoutMs, maxAttempts, embed };
};
