/**
 * Embedding provider for any OpenAI-compatible endpoint.
 *
 * OpenRouter, OpenAI and most other vendors expose the same shape:
 * POST {baseUrl}/embeddings {model, input} returns {data: [{embedding, index}]}.
 * Pointing EMBEDDING_API_BASE_URL and EMBEDDING_MODEL elsewhere is the whole vendor swap.
 */

/**
 * What a successful embedding call returns. The vectors come back in the same order as the
 * texts that were sent. The attempt count and latency are recorded so the runner can report
 * how much retrying a run needed.
 */
export interface EmbedResult {
  vectors: number[][];
  /** Total attempts spent on this call, including the successful one. */
  attempts: number;
  /** Wall time of the successful request in milliseconds. */
  latencyMs: number;
}

/**
 * A configured embedding endpoint that the runner can call. The model and base URL are
 * exposed so they can be logged and stored alongside every vector. The timeout and attempt
 * limit are exposed so the startup banner can report them.
 */
export interface EmbeddingProvider {
  model: string;
  baseUrl: string;
  timeoutMs: number;
  maxAttempts: number;
  embed: (texts: string[]) => Promise<EmbedResult>;
}

/**
 * An embedding request that failed in a way the caller needs details about. It carries the
 * HTTP status, the response body, and how many attempts were spent, so a failure can be
 * recorded in the manifest without re-parsing the message.
 */
export class EmbeddingRequestError extends Error {
  status: number | null;

  attempts: number;

  body: string;

  /** True when the server asked for a wait longer than the run will honour. */
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

// Statuses that can succeed on a later attempt, so any other status fails immediately.
const RETRYABLE_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);
const BASE_BACKOFF_MS = 2000;
const MAX_BACKOFF_MS = 60_000;

// The longest Retry-After the run will honour before it gives up and stops.
const MAX_RETRY_AFTER_MS = MAX_BACKOFF_MS;

// Reads a positive number from an environment value, falling back when it is unset or invalid.
const number = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

// Pauses for the given number of milliseconds.
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Formats milliseconds as whole seconds for log messages.
const seconds = (ms: number) => `${Math.round(ms / 1000)}s`;

/**
 * How long to wait before the next attempt, doubling with each one up to a ceiling. The
 * result carries plus or minus twenty percent of jitter, which stops concurrent workers
 * retrying at the same moment and re-triggering the same rate limit together.
 */
const backoffDelay = (attempt: number): number => {
  const base = Math.min(BASE_BACKOFF_MS * Math.pow(2, attempt - 1), MAX_BACKOFF_MS);

  return Math.round(base * (0.8 + Math.random() * 0.4));
};

/**
 * Parses a Retry-After header in either delta-seconds or HTTP-date form. Returns the wait
 * in milliseconds, or null when the header is absent or unparseable. A date already in the
 * past clamps to zero.
 */
const parseRetryAfter = (value: string | null): number | null => {
  // An explicit check because "0" is falsy in JavaScript and legally means retry now.
  if (value === null || value.trim() === '') return null;

  const deltaSeconds = Number(value);

  if (Number.isFinite(deltaSeconds)) return Math.max(0, deltaSeconds * 1000);

  const date = Date.parse(value);

  if (Number.isNaN(date)) return null;

  return Math.max(0, date - Date.now());
};

/**
 * Builds a provider from the EMBEDDING_* environment variables. Every setting except the
 * API key has a default that works against the configured model, so a caller normally only
 * needs to supply EMBEDDING_API_KEY. Throws immediately when that key is missing.
 */
export const createEmbeddingProvider = (): EmbeddingProvider => {
  // Trailing slashes are stripped so joining "/embeddings" below cannot double up.
  const baseUrl = (process.env.EMBEDDING_API_BASE_URL || 'https://openrouter.ai/api/v1').replace(
    /\/+$/,
    ''
  );

  const model = process.env.EMBEDDING_MODEL || 'nvidia/nemotron-3-embed-1b:free';
  const apiKey = process.env.EMBEDDING_API_KEY;

  if (!apiKey) {
    throw new Error('EMBEDDING_API_KEY is required.');
  }

  const timeoutMs = number(process.env.EMBEDDING_TIMEOUT_MS, 120_000);
  const maxAttempts = number(process.env.EMBEDDING_MAX_ATTEMPTS, 6);

  /**
   * Sends all texts in one request and returns one vector per text. Retryable failures are
   * attempted again with exponential backoff until maxAttempts is reached, while a status
   * the server will keep rejecting fails straight away. Throws EmbeddingRequestError when
   * no attempt succeeds.
   */
  const embed = async (texts: string[]): Promise<EmbedResult> => {
    // Carried across attempts so the final error can report what actually went wrong.
    let lastStatus: number | null = null;
    let lastBody = '';
    let lastMessage = 'unknown error';

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      // An AbortController paired with a timer is how fetch gets a per-request timeout.
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
          body: JSON.stringify({ model, input: texts }),
          signal: controller.signal,
        });

        const latencyMs = Date.now() - startedAt;

        if (response.ok) {
          const json: any = await response.json();
          const data = json?.data;

          if (!Array.isArray(data) || data.length !== texts.length) {
            throw new Error(
              `unexpected response: expected ${texts.length} embeddings, got ${
                Array.isArray(data) ? data.length : typeof data
              }`
            );
          }

          // Each item carries its own index, so sort by it before mapping to vectors.
          const vectors = [...data]
            .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
            .map((entry) => entry.embedding as number[]);

          if (vectors.some((vector) => !Array.isArray(vector) || vector.length === 0)) {
            throw new Error('unexpected response: an embedding was empty or not an array');
          }

          return { vectors, attempts: attempt, latencyMs };
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

        const aborted = e?.name === 'AbortError';

        lastMessage = aborted ? `timeout after ${seconds(timeoutMs)}` : e?.message || String(e);

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

    // Reached only when every attempt failed without throwing a non-retryable error.
    throw new EmbeddingRequestError(
      `gave up after ${maxAttempts} attempts: ${lastMessage}${lastBody ? `: ${lastBody}` : ''}`,
      { status: lastStatus, attempts: maxAttempts, body: lastBody }
    );
  };

  return { model, baseUrl, timeoutMs, maxAttempts, embed };
};
