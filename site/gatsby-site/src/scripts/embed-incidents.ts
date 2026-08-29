/**
 * Generates an embedding for every incident from its title and report bodies.
 *
 * @example npm run embed-incidents -- --limit 5
 * @example npm run embed-incidents -- --incident-id 1 --incident-id 2
 * @example npm run embed-incidents -- --resume
 *
 * Each incident is written the moment it completes, so an interrupted run keeps
 * everything it had already finished. `--resume` then skips those.
 */

import { MongoClient, type Collection } from 'mongodb';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { writeFileSync } from 'fs';

import { createEmbeddingProvider, EmbeddingRequestError } from '../utils/embeddings/provider';
import { buildIncidentText, chunkText, poolVectors } from '../utils/embeddings/incidentText';

const DB_NAME = 'aiidprod';
const EMBEDDINGS_COLLECTION = 'incident_embeddings';

/** Diagnostic list of what failed. The GitHub Action uploads this by name. */
const FAILURES_FILE = 'embed-failures.json';

/** How often to print a progress line during a long run. */
const PROGRESS_EVERY = 50;

/** How many failures in a row end the run. */
const MAX_CONSECUTIVE_FAILURES = 10;

/** Chunk size in characters, kept low because the model accepts much less than its advertised context. */
const DEFAULT_MAX_INPUT_CHARS = 8000;

/** How many times to shrink the char budget when the server reports a token overflow. */
const MAX_REBUDGET_ATTEMPTS = 3;

/** Floor for the shrinking budget, so a pathological input cannot spiral. */
const MIN_INPUT_CHARS = 500;

/** Formats a duration in ms as a compact human string: 950ms, 2.4s, 3m12s. */
const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${Math.round(ms)}ms`;

  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;

  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.round((ms % 60_000) / 1000);

  if (minutes < 60) return `${minutes}m${String(seconds).padStart(2, '0')}s`;

  return `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}m`;
};

/**
 * failure manifest records enough to diagnose an incident without
 * re-running it, and the file is uploaded as an artifact by the GitHub Action.
 */
interface Failure {
  incident_id: number;
  attempts: number;
  status: number | null;
  error: string;
}

const argv = yargs(hideBin(process.argv))
  .usage('Usage: npm run embed-incidents -- [options]')
  .option('incident-id', {
    describe: 'Only embed these incident ids (repeatable)',
    type: 'number',
    array: true,
  })
  .option('limit', { describe: 'Process at most this many incidents', type: 'number' })
  .option('resume', {
    describe: 'Skip incidents already embedded with the current model',
    type: 'boolean',
    default: false,
  })
  .help()
  .alias('h', 'help')
  .parseSync();

/**
 * Runs the whole job: selects the incidents to embed, drives a pool of workers over them,
 * and reports what happened. Returns the process exit code, which is 0 when everything
 * succeeded, 1 on any failure or early stop, and 130 when a signal ended the run.
 */
const main = async () => {
  const connectionString = process.env.MONGODB_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error('MONGODB_CONNECTION_STRING is required.');
  }

  const provider = createEmbeddingProvider();
  const maxInputChars = Number(process.env.EMBEDDING_MAX_INPUT_CHARS) || DEFAULT_MAX_INPUT_CHARS;
  const concurrency = Number(process.env.EMBEDDING_CONCURRENCY) || 2;
  const client = new MongoClient(connectionString);

  await client.connect();

  const db = client.db(DB_NAME);
  const incidentsCollection = db.collection('incidents');
  const reportsCollection = db.collection('reports');
  const embeddingsCollection: Collection = db.collection(EMBEDDINGS_COLLECTION);

  try {
    const filter: Record<string, any> = {};

    if (argv['incident-id']?.length) {
      filter.incident_id = { $in: argv['incident-id'] };
    }

    // Anything that failed was never stored, so resume retries it as a matter of course.
    if (argv.resume) {
      const done = await embeddingsCollection.distinct('incident_id', { model: provider.model });

      if (done.length > 0) {
        filter.incident_id = filter.incident_id
          ? { ...filter.incident_id, $nin: done }
          : { $nin: done };

        console.log(`resume: skipping ${done.length} incident(s) already embedded`);
      }
    }

    const incidents = await incidentsCollection
      .find(filter, { projection: { _id: 0, incident_id: 1, title: 1, reports: 1 } })
      .sort({ incident_id: 1 })
      // The driver treats a limit of 0 as no limit at all.
      .limit(argv.limit ?? 0)
      .toArray();

    const rule = '-'.repeat(72);

    console.log(rule);
    console.log(`base url    ${provider.baseUrl}`);
    console.log(`model       ${provider.model}`);
    console.log(`writing to  ${DB_NAME}.${EMBEDDINGS_COLLECTION}`);
    console.log(
      `limits      max_input_chars=${maxInputChars} timeout=${formatDuration(
        provider.timeoutMs
      )} max_attempts=${provider.maxAttempts}`
    );
    console.log(`concurrency ${concurrency}`);
    console.log(`incidents   ${incidents.length}`);
    console.log(rule);

    if (incidents.length === 0) {
      console.log('Nothing to do.');
      return 0;
    }

    // The unique index is what keeps concurrent workers from writing two rows for one incident.
    await embeddingsCollection.createIndex({ incident_id: 1 }, { unique: true });

    const startedAt = Date.now();
    const latencies: number[] = [];
    const failures: Failure[] = [];
    let completed = 0;
    let retried = 0;
    let chunkedIncidents = 0;
    let totalChunks = 0;
    let cursor = 0;
    let consecutiveFailures = 0;

    /** Set when the run should stop dispatching new work: a signal or the breaker. */
    let stopReason: string | null = null;

    /**
     * Writes the failure manifest to disk. It runs after every single failure, so a hard stop
     * such as Ctrl-C or an Actions timeout still leaves the list behind. Failures are rare and
     * the file is small, so the repeated writes cost nothing.
     */
    const flushFailures = () => {
      if (failures.length === 0) return;

      try {
        writeFileSync(FAILURES_FILE, JSON.stringify(failures, null, 2));
      } catch (e: any) {
        console.error(`could not write failure manifest: ${e?.message || e}`);
      }
    };

    for (const signal of ['SIGINT', 'SIGTERM'] as const) {
      process.on(signal, () => {
        // A second signal falls through to the default handler and kills the process.
        if (stopReason) return;
        stopReason = `received ${signal}`;
        console.warn(`${signal} received, finishing in-flight requests then stopping`);
      });
    }

    /**
     * Embeds a single incident and stores the result. It gathers the incident's reports,
     * builds and chunks the text, calls the provider, pools the chunk vectors into one, and
     * upserts the document. Throws on failure so the worker can record it and carry on.
     */
    const processOne = async (incident: any) => {
      const incidentStartedAt = Date.now();

      const reports = incident.reports?.length
        ? await reportsCollection
            .find(
              { report_number: { $in: incident.reports } },
              { projection: { _id: 0, report_number: 1, plain_text: 1, text: 1 } }
            )
            .toArray()
        : [];

      const text = buildIncidentText(incident, reports);
      let chunks = chunkText(text, maxInputChars);

      if (chunks.length === 0) {
        throw new EmbeddingRequestError('incident has no title or report text to embed', {
          status: null,
          attempts: 0,
          body: '',
        });
      }

      if (chunks.length > 1) chunkedIncidents++;

      totalChunks += chunks.length;

      let budget = maxInputChars;
      let result: Awaited<ReturnType<typeof provider.embed>> | null = null;

      for (let shrink = 0; shrink <= MAX_REBUDGET_ATTEMPTS; shrink++) {
        try {
          // All chunks in one request, so a chunked incident is still a single call.
          result = await provider.embed(chunks);
          break;
        } catch (e: any) {
          const overflow =
            e instanceof EmbeddingRequestError && e.status === 422
              ? /input length (\d+) exceeds model maximum (\d+)/.exec(e.body)
              : null;

          if (!overflow || shrink === MAX_REBUDGET_ATTEMPTS) throw e;

          const [, reported, maximum] = overflow;
          const previousChunks = chunks.length;

          // Chars per token range from about 4 for Latin text down to near 1 for CJK.
          budget = Math.max(
            MIN_INPUT_CHARS,
            Math.floor(budget * (Number(maximum) / Number(reported)) * 0.8)
          );

          chunks = chunkText(text, budget);

          totalChunks += chunks.length - previousChunks;

          console.warn(
            `incident ${incident.incident_id} exceeded the token limit ` +
              `(${reported} > ${maximum}), re-chunking at ${budget} chars ` +
              `into ${chunks.length} chunks`
          );
        }
      }

      // The loop above either assigned a result or threw, so the assertion is safe.
      const { vectors, attempts, latencyMs } = result!;

      latencies.push(latencyMs);

      if (attempts > 1) retried++;

      const vector = poolVectors(vectors);

      // Upserting on incident_id means a re-run overwrites the row it wrote last time.
      await embeddingsCollection.updateOne(
        { incident_id: incident.incident_id },
        {
          $set: {
            incident_id: incident.incident_id,
            vector,
            dims: vector.length,
            model: provider.model,
            base_url: provider.baseUrl,
            chunks: chunks.length,
            source_chars: text.length,
            generated_at: new Date(),
          },
        },
        { upsert: true }
      );

      const position = `${completed + failures.length + 1}/${incidents.length}`;

      console.log(
        `[${position}] incident ${incident.incident_id} ok ` +
          `chunks=${chunks.length} chars=${text.length} dims=${vector.length} ` +
          `attempts=${attempts} ${formatDuration(Date.now() - incidentStartedAt)}`
      );
    };

    /**
     * Pulls incidents off the shared cursor until they run out or the run is told to stop.
     * Several of these run concurrently, and because they all advance the same cursor no two
     * workers ever take the same incident. A failure is recorded here and the loop carries on,
     * so one bad incident leaves the rest of the run intact.
     */
    const worker = async () => {
      while (cursor < incidents.length && !stopReason) {
        const incident = incidents[cursor++];

        try {
          await processOne(incident);
          completed++;
          consecutiveFailures = 0;
        } catch (e: any) {
          failures.push({
            incident_id: incident.incident_id,
            attempts: e instanceof EmbeddingRequestError ? e.attempts : 0,
            status: e instanceof EmbeddingRequestError ? e.status : null,
            error: e?.message || String(e),
          });

          console.error(`incident ${incident.incident_id} failed: ${e?.message || e}`);

          flushFailures();

          consecutiveFailures++;

          // A quota error will hit every remaining incident, so stop the whole run now.
          if (e instanceof EmbeddingRequestError && e.quotaExhausted) {
            stopReason = 'provider reported quota exhaustion';
          } else if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
            stopReason = `${consecutiveFailures} consecutive failures`;
          }
        }

        const processed = completed + failures.length;

        if (processed % PROGRESS_EVERY === 0 && processed < incidents.length) {
          const elapsed = Date.now() - startedAt;
          const remaining = Math.round((elapsed / processed) * (incidents.length - processed));

          console.log(
            `progress ${processed}/${incidents.length} ok=${completed} failed=${failures.length} ` +
              `retried=${retried} elapsed=${formatDuration(elapsed)} eta=${formatDuration(
                remaining
              )}`
          );
        }
      }
    };

    // Never fewer than one worker and never more workers than there are incidents.
    await Promise.all(
      Array.from({ length: Math.max(1, Math.min(concurrency, incidents.length)) }, worker)
    );

    const elapsed = Date.now() - startedAt;

    const average = latencies.length
      ? latencies.reduce((sum, value) => sum + value, 0) / latencies.length
      : 0;

    console.log(rule);

    if (stopReason) {
      console.error(`STOPPED EARLY  ${stopReason}`);
      console.error(`not attempted  ${incidents.length - completed - failures.length} incident(s)`);
    }

    console.log(`succeeded   ${completed}/${incidents.length}`);
    console.log(`failed      ${failures.length}`);
    console.log(`retried     ${retried}`);
    console.log(`chunked     ${chunkedIncidents} incident(s), ${totalChunks} chunk(s) total`);
    console.log(`wall time   ${formatDuration(elapsed)}`);
    console.log(`latency     avg=${formatDuration(average)}`);

    if (failures.length > 0) {
      flushFailures();
      console.error(`failure manifest written to ${FAILURES_FILE}`);
    }

    if (stopReason || failures.length > 0) {
      console.error('resume with: npm run embed-incidents -- --resume');
    }

    console.log(rule);

    // 130 is the conventional exit code for a process stopped by a signal.
    if (stopReason) return stopReason.startsWith('received SIG') ? 130 : 1;

    return failures.length > 0 ? 1 : 0;
  } finally {
    await client.close();
  }
};

if (require.main === module) {
  main()
    .then((code) => process.exit(code))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
