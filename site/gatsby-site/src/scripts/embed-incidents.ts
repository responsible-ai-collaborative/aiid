/** Builds overview and report-passage embeddings for incidents and stores one document per incident. */

import { createHash } from 'crypto';
import { writeFileSync } from 'fs';
import { Binary, MongoClient, type Collection } from 'mongodb';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { createEmbeddingProvider, EmbeddingRequestError } from '../utils/embeddings/provider';
import {
  buildIncidentOverview,
  chunkTextWithOffsets,
  getReportBody,
  sortReports,
  type ReportTextSource,
} from '../utils/embeddings/incidentText';

const DB_NAME = 'aiidprod';
const EMBEDDINGS_COLLECTION = 'incident_embeddings';
const EMBEDDING_SCHEMA_VERSION = 2;
const FAILURES_FILE = 'embed-failures.json';
const PROGRESS_EVERY = 50;
const MAX_CONSECUTIVE_FAILURES = 10;
const DEFAULT_MAX_INPUT_CHARS = 8000;
const DEFAULT_CHUNK_OVERLAP_CHARS = 200;
const DEFAULT_BATCH_SIZE = 32;
const MAX_REBUDGET_ATTEMPTS = 3;
const MIN_INPUT_CHARS = 500;

interface Failure {
  incident_id: number;
  attempts: number;
  status: number | null;
  error: string;
}

type PassageInput = {
  reportNumber: number;
  chunkIndex: number;
  startChar: number;
  endChar: number;
  sourceHash: string;
  input: string;
};

const argv = yargs(hideBin(process.argv))
  .usage('Usage: npm run embed-incidents -- [options]')
  .option('incident-id', {
    describe: 'Only embed these incident ids (repeatable)',
    type: 'number',
    array: true,
  })
  .option('limit', { describe: 'Process at most this many incidents', type: 'number' })
  .option('resume', {
    describe: 'Skip incidents whose source and embedding configuration have not changed',
    type: 'boolean',
    default: false,
  })
  .help()
  .alias('h', 'help')
  .parseSync();

const positiveInteger = (value: string | undefined, fallback: number, name: string): number => {
  if (value === undefined || value.trim() === '') return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return parsed;
};

const assertPositiveInteger = (value: number, name: string) => {
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${name} must be a positive integer`);
};

const sha256 = (value: string): string => createHash('sha256').update(value).digest('hex');
const compactVector = (vector: number[]): Binary =>
  Binary.fromFloat32Array(Float32Array.from(vector));

const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;

  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.round((ms % 60_000) / 1000);
  return minutes < 60
    ? `${minutes}m${String(seconds).padStart(2, '0')}s`
    : `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}m`;
};

const buildPassages = (
  reports: readonly ReportTextSource[],
  title: string,
  maxChars: number,
  overlapChars: number
): PassageInput[] =>
  sortReports(reports).flatMap((report) => {
    const body = getReportBody(report);
    if (!body) return [];

    return chunkTextWithOffsets(body, maxChars, overlapChars).map((chunk, chunkIndex) => ({
      reportNumber: report.report_number ?? 0,
      chunkIndex,
      startChar: chunk.startChar,
      endChar: chunk.endChar,
      sourceHash: sha256(chunk.text),
      input: title ? `Incident title: ${title}\n\n${chunk.text}` : chunk.text,
    }));
  });

const sourceFingerprint = (incident: any, reports: readonly ReportTextSource[]): string =>
  sha256(
    JSON.stringify({
      title: (incident.title || '').trim(),
      description: (incident.description || '').trim(),
      reports: sortReports(reports).map((report) => ({
        report_number: report.report_number ?? null,
        body: getReportBody(report),
      })),
    })
  );

const overflowBudget = (error: unknown, currentBudget: number): number | null => {
  if (
    !(error instanceof EmbeddingRequestError) ||
    error.status === null ||
    ![400, 413, 422].includes(error.status)
  ) {
    return null;
  }

  const counts = /input length\D+(\d+)\D+(?:model )?maximum\D+(\d+)/i.exec(error.body);
  const reduced = counts
    ? Math.floor(currentBudget * (Number(counts[2]) / Number(counts[1])) * 0.8)
    : Math.floor(currentBudget / 2);

  return Math.max(MIN_INPUT_CHARS, reduced);
};

const main = async (): Promise<number> => {
  const connectionString = process.env.MONGODB_CONNECTION_STRING;
  if (!connectionString) throw new Error('MONGODB_CONNECTION_STRING is required.');

  if (argv.limit !== undefined) assertPositiveInteger(argv.limit, '--limit');
  for (const id of argv['incident-id'] || []) assertPositiveInteger(id, '--incident-id');

  const provider = createEmbeddingProvider();
  const maxInputChars = positiveInteger(
    process.env.EMBEDDING_MAX_INPUT_CHARS,
    DEFAULT_MAX_INPUT_CHARS,
    'EMBEDDING_MAX_INPUT_CHARS'
  );
  const overlapChars = positiveInteger(
    process.env.EMBEDDING_CHUNK_OVERLAP_CHARS,
    DEFAULT_CHUNK_OVERLAP_CHARS,
    'EMBEDDING_CHUNK_OVERLAP_CHARS'
  );
  const batchSize = positiveInteger(
    process.env.EMBEDDING_BATCH_SIZE,
    DEFAULT_BATCH_SIZE,
    'EMBEDDING_BATCH_SIZE'
  );
  const concurrency = positiveInteger(
    process.env.EMBEDDING_CONCURRENCY,
    2,
    'EMBEDDING_CONCURRENCY'
  );

  if (overlapChars >= maxInputChars) {
    throw new Error('EMBEDDING_CHUNK_OVERLAP_CHARS must be smaller than EMBEDDING_MAX_INPUT_CHARS');
  }

  const indexSignature = sha256(
    JSON.stringify({
      schema: EMBEDDING_SCHEMA_VERSION,
      model: provider.model,
      baseUrl: provider.baseUrl,
      profile: provider.profileId,
      maxInputChars,
      overlapChars,
    })
  );
  const client = new MongoClient(connectionString);
  await client.connect();

  const db = client.db(DB_NAME);
  const incidentsCollection = db.collection('incidents');
  const reportsCollection = db.collection('reports');
  const embeddingsCollection: Collection = db.collection(EMBEDDINGS_COLLECTION);

  try {
    const filter: Record<string, any> = {};
    if (argv['incident-id']?.length) filter.incident_id = { $in: argv['incident-id'] };

    const incidents = await incidentsCollection
      .find(filter, {
        projection: { _id: 0, incident_id: 1, title: 1, description: 1, reports: 1 },
      })
      .sort({ incident_id: 1 })
      .limit(argv.limit ?? 0)
      .toArray();

    const rule = '-'.repeat(72);
    console.log(rule);
    console.log(`base url    ${provider.baseUrl}`);
    console.log(`model       ${provider.model}`);
    console.log(`profile     ${provider.profileId}`);
    console.log(`signature   ${indexSignature.slice(0, 12)}`);
    console.log(`writing to  ${DB_NAME}.${EMBEDDINGS_COLLECTION}`);
    console.log(
      `limits      max_chars=${maxInputChars} overlap=${overlapChars} batch=${batchSize} ` +
        `timeout=${formatDuration(provider.timeoutMs)} max_attempts=${provider.maxAttempts}`
    );
    console.log(`concurrency ${concurrency}`);
    console.log(`incidents   ${incidents.length}`);
    console.log(rule);

    if (incidents.length === 0) {
      console.log('Nothing to do.');
      return 0;
    }

    await embeddingsCollection.createIndex({ incident_id: 1 }, { unique: true });

    const startedAt = Date.now();
    const latencies: number[] = [];
    const failures: Failure[] = [];
    let completed = 0;
    let skipped = 0;
    let retried = 0;
    let chunkedIncidents = 0;
    let totalPassages = 0;
    let cursor = 0;
    let consecutiveFailures = 0;
    let stopReason: string | null = null;

    const flushFailures = () => {
      if (failures.length === 0) return;
      try {
        writeFileSync(FAILURES_FILE, JSON.stringify(failures, null, 2));
      } catch (error: any) {
        console.error(`could not write failure manifest: ${error?.message || error}`);
      }
    };

    for (const signal of ['SIGINT', 'SIGTERM'] as const) {
      process.on(signal, () => {
        if (stopReason) {
          console.error(`${signal} received again, exiting immediately`);
          process.exit(130);
        }
        stopReason = `received ${signal}`;
        console.warn(`${signal} received, finishing in-flight requests then stopping`);
      });
    }

    const embedInBatches = async (inputs: string[]) => {
      const vectors: number[][] = [];
      let attempts = 0;
      let latencyMs = 0;
      let hadRetry = false;

      for (let offset = 0; offset < inputs.length; offset += batchSize) {
        const result = await provider.embed(inputs.slice(offset, offset + batchSize), 'document');
        vectors.push(...result.vectors);
        attempts += result.attempts;
        latencyMs += result.latencyMs;
        hadRetry ||= result.attempts > 1;
      }

      return { vectors, attempts, latencyMs, hadRetry };
    };

    const processOne = async (incident: any): Promise<'embedded' | 'skipped'> => {
      const incidentStartedAt = Date.now();
      const reports = incident.reports?.length
        ? await reportsCollection
            .find(
              { report_number: { $in: incident.reports } },
              { projection: { _id: 0, report_number: 1, plain_text: 1, text: 1 } }
            )
            .toArray()
        : [];
      const overview = buildIncidentOverview(incident);

      if (!overview) {
        throw new EmbeddingRequestError('incident has no title or description to embed', {
          status: null,
          attempts: 0,
          body: '',
        });
      }

      const sourceHash = sourceFingerprint(incident, reports);
      if (argv.resume) {
        const existing = await embeddingsCollection.findOne(
          {
            incident_id: incident.incident_id,
            embedding_schema_version: EMBEDDING_SCHEMA_VERSION,
            index_signature: indexSignature,
            source_hash: sourceHash,
          },
          { projection: { _id: 1 } }
        );
        if (existing) return 'skipped';
      }

      const title = (incident.title || '').trim();
      let budget = maxInputChars;
      let passages = buildPassages(reports, title, budget, Math.min(overlapChars, budget - 1));
      let embedded: Awaited<ReturnType<typeof embedInBatches>> | null = null;

      for (let shrink = 0; shrink <= MAX_REBUDGET_ATTEMPTS; shrink++) {
        try {
          embedded = await embedInBatches([overview, ...passages.map((passage) => passage.input)]);
          break;
        } catch (error) {
          const nextBudget = overflowBudget(error, budget);
          if (nextBudget === null || nextBudget >= budget || shrink === MAX_REBUDGET_ATTEMPTS) {
            throw error;
          }

          budget = nextBudget;
          passages = buildPassages(reports, title, budget, Math.min(overlapChars, budget - 1));
          console.warn(
            `incident ${incident.incident_id} exceeded the model context; ` +
              `re-chunking at ${budget} chars into ${passages.length} passages`
          );
        }
      }

      const { vectors, attempts, latencyMs, hadRetry } = embedded!;
      const dimensions = vectors[0].length;
      if (
        vectors.length !== passages.length + 1 ||
        vectors.some((vector) => vector.length !== dimensions)
      ) {
        throw new Error('provider returned inconsistent vectors across batches');
      }

      latencies.push(latencyMs);
      if (hadRetry) retried++;
      if (passages.length > reports.filter((report) => getReportBody(report)).length)
        chunkedIncidents++;
      totalPassages += passages.length;

      await embeddingsCollection.replaceOne(
        { incident_id: incident.incident_id },
        {
          incident_id: incident.incident_id,
          embedding_schema_version: EMBEDDING_SCHEMA_VERSION,
          embedding_profile: provider.profileId,
          index_signature: indexSignature,
          source_hash: sourceHash,
          model: provider.model,
          base_url: provider.baseUrl,
          dims: dimensions,
          overview: {
            source_chars: overview.length,
            vector: compactVector(vectors[0]),
          },
          passages: passages.map((passage, index) => ({
            report_number: passage.reportNumber,
            chunk_index: passage.chunkIndex,
            start_char: passage.startChar,
            end_char: passage.endChar,
            source_hash: passage.sourceHash,
            vector: compactVector(vectors[index + 1]),
          })),
          passage_count: passages.length,
          source_chars:
            overview.length +
            reports.reduce((sum, report) => sum + getReportBody(report).length, 0),
          generated_at: new Date(),
        },
        { upsert: true }
      );

      const position = completed + skipped + failures.length + 1;
      console.log(
        `[${position}/${incidents.length}] incident ${incident.incident_id} ok ` +
          `passages=${passages.length} dims=${dimensions} requests=${Math.ceil(
            vectors.length / batchSize
          )} ` +
          `attempts=${attempts} ${formatDuration(Date.now() - incidentStartedAt)}`
      );
      return 'embedded';
    };

    const worker = async () => {
      while (cursor < incidents.length && !stopReason) {
        const incident = incidents[cursor++];

        try {
          const result = await processOne(incident);
          if (result === 'skipped') skipped++;
          else completed++;
          consecutiveFailures = 0;
        } catch (error: any) {
          failures.push({
            incident_id: incident.incident_id,
            attempts: error instanceof EmbeddingRequestError ? error.attempts : 0,
            status: error instanceof EmbeddingRequestError ? error.status : null,
            error: error?.message || String(error),
          });
          console.error(`incident ${incident.incident_id} failed: ${error?.message || error}`);
          flushFailures();
          consecutiveFailures++;

          if (error instanceof EmbeddingRequestError && error.quotaExhausted) {
            stopReason = 'provider reported quota exhaustion';
          } else if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
            stopReason = `${consecutiveFailures} consecutive failures`;
          }
        }

        const processed = completed + skipped + failures.length;
        if (processed > 0 && processed % PROGRESS_EVERY === 0 && processed < incidents.length) {
          const elapsed = Date.now() - startedAt;
          const remaining = Math.round((elapsed / processed) * (incidents.length - processed));
          console.log(
            `progress ${processed}/${incidents.length} embedded=${completed} skipped=${skipped} ` +
              `failed=${failures.length} elapsed=${formatDuration(elapsed)} eta=${formatDuration(
                remaining
              )}`
          );
        }
      }
    };

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
      console.error(
        `not attempted  ${incidents.length - completed - skipped - failures.length} incident(s)`
      );
    }
    console.log(`embedded    ${completed}/${incidents.length}`);
    console.log(`skipped     ${skipped}`);
    console.log(`failed      ${failures.length}`);
    console.log(`retried     ${retried}`);
    console.log(`passages    ${totalPassages} (${chunkedIncidents} multi-chunk incident(s))`);
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

    if (stopReason) return String(stopReason).startsWith('received SIG') ? 130 : 1;
    return failures.length > 0 ? 1 : 0;
  } finally {
    await client.close();
  }
};

if (require.main === module) {
  main()
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
