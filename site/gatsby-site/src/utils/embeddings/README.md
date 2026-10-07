# Incident Embeddings

This pipeline prepares incident data for semantic retrieval. It writes one document per incident
to `aiidprod.incident_embeddings`; query and UI changes are deliberately outside this pipeline.

## Representation

Each incident gets two complementary representations:

1. One overview embedding from the existing incident `title` and `description`. This is the
   broad-recall vector for queries such as “deepfake related incidents.” It is not an
   LLM-generated summary.
2. One embedding for each bounded chunk of each linked report body. Report bodies are never
   pooled into a single average, so a relevant passage is not diluted by unrelated articles.

Article text remains in `reports`; it is not copied into the embedding collection. Passage
metadata stores `report_number`, chunk index, character offsets, and a source hash so the source
can be retrieved later. Chunks overlap by 200 characters by default to avoid losing a match at a
boundary. Oversized inputs are re-chunked at a smaller budget when the provider reports a context
limit.

The overview and passages live in the same document because they share the same incident lifecycle
and fit comfortably below MongoDB's document limit. For the current corpus, the estimate is about
8,768 vectors (median 3, p95 20, maximum 65 per incident). Float32 BSON vectors are about 69 MB of
raw vector data at 2,048 dimensions, versus roughly 230–280 MB as ordinary BSON number arrays.

## Stored document

```js
{
  incident_id: 39,
  embedding_schema_version: 2,
  embedding_profile: 'nemotron-retrieval-v1',
  index_signature: 'sha256...',
  source_hash: 'sha256...',
  model: 'nvidia/nemotron-3-embed-1b:free',
  base_url: 'https://openrouter.ai/api/v1',
  dims: 2048,
  overview: {
    source_chars: 164,
    vector: BinData(9, '...') // BSON Float32 vector
  },
  passages: [{
    report_number: 123,
    chunk_index: 0,
    start_char: 0,
    end_char: 7814,
    source_hash: 'sha256...',
    vector: BinData(9, '...')
  }],
  passage_count: 4,
  source_chars: 27190,
  generated_at: ISODate('2026-09-16T12:00:00Z')
}
```

Writes use `replaceOne(..., {upsert: true})` with a unique `incident_id` index. Re-running replaces
the incident atomically and also removes fields from the legacy pooled-vector schema.

`--resume` skips a document only when all three of these still match:

- `embedding_schema_version`
- `index_signature` (model, endpoint, profile, and chunk settings)
- `source_hash` (title, description, report numbers, and report bodies)

Changing source text, the model, provider, profile, or chunk configuration therefore causes the
right incidents to be regenerated instead of silently retaining stale vectors.

## Model portability

The request defaults to the standard OpenAI-compatible shape:

```text
POST {baseUrl}/embeddings  {model, input}
```

The model name selects an optional local request profile. The Nemotron embedding profile adds
`input_type: passage` for pipeline inputs (and supports `query` for a future query caller).
Unrecognized models add no vendor-specific fields, so switching an OpenAI-compatible model normally
requires only changing `EMBEDDING_MODEL` and, if necessary, `EMBEDDING_API_BASE_URL`.

Provider responses are rejected if indices are missing or duplicated, dimensions differ, or a
vector is empty or contains non-finite values. Large incidents are sent in bounded batches.

## Run locally

Set these values in `site/gatsby-site/.env`:

```bash
MONGODB_CONNECTION_STRING=mongodb://127.0.0.1:4110
EMBEDDING_API_KEY=your-key-here
```

Then run from `site/gatsby-site`:

```bash
npm run embed-incidents -- --limit 5
npm run embed-incidents -- --incident-id 39
npm run embed-incidents -- --resume
```

| Option            | Effect                                                            |
| ----------------- | ----------------------------------------------------------------- |
| `--limit N`       | Process at most the first positive integer `N` incidents.         |
| `--incident-id N` | Process only this incident; repeatable.                           |
| `--resume`        | Skip only documents whose source and index signature are current. |

Each successful incident is stored immediately. Failures go to `embed-failures.json`, and the run
stops after quota exhaustion or ten consecutive failures. One signal finishes in-flight work; a
second exits immediately.

## GitHub Actions

Run **Embed Incidents** manually and select a GitHub Environment. Start with `limit: 5` against a
non-production database, inspect the stored documents, then run the full job. The workflow uses
Node 22 and passes its typed inputs through environment variables and a Bash argument array.

The selected environment needs:

- `MONGODB_CONNECTION_STRING` as a secret, for a user with `readWrite` on `aiidprod`.
- `EMBEDDING_API_KEY` as a secret.
- Network access from the runner to MongoDB. Prefer a self-hosted runner with fixed egress or a
  maintained allowlist of GitHub's published Actions ranges; do not open Atlas to `0.0.0.0/0`.

The failure manifest is uploaded even when the job fails. Re-run with `resume` after correcting the
cause.

The workflow also runs every night at 08:00 UTC (midnight US Pacific Standard Time) against the
`production` environment with `--resume`, so it only embeds new or changed incidents. If the
provider's quota runs out, the run stops early and the next night continues where it left off.
GitHub only runs schedules from the workflow file on the repository's default branch.

## Configuration

| Name                            |                           Default | Purpose                                        |
| ------------------------------- | --------------------------------: | ---------------------------------------------- |
| `EMBEDDING_API_BASE_URL`        |    `https://openrouter.ai/api/v1` | OpenAI-compatible API base URL.                |
| `EMBEDDING_MODEL`               | `nvidia/nemotron-3-embed-1b:free` | Provider model identifier.                     |
| `EMBEDDING_MAX_INPUT_CHARS`     |                            `8000` | Initial maximum characters per report passage. |
| `EMBEDDING_CHUNK_OVERLAP_CHARS` |                             `200` | Character overlap between adjacent passages.   |
| `EMBEDDING_BATCH_SIZE`          |                              `32` | Maximum inputs sent in one provider request.   |
| `EMBEDDING_CONCURRENCY`         |                               `2` | Incidents processed concurrently.              |
| `EMBEDDING_TIMEOUT_MS`          |                          `120000` | Per-request timeout.                           |
| `EMBEDDING_MAX_ATTEMPTS`        |                               `6` | Attempts per provider request.                 |

Numeric settings must be positive integers, and overlap must be smaller than the input budget.
Transient statuses are retried with exponential backoff and jitter. `Retry-After` is honored up to
60 seconds; a longer delay is treated as quota exhaustion so completed work can be resumed later.

## Verification

After a five-incident smoke test:

```js
use aiidprod
db.incident_embeddings.countDocuments()
db.incident_embeddings.findOne({}, { 'overview.vector': 0, 'passages.vector': 0 })
```

Confirm schema version 2, the expected model/profile, non-empty passages where reports have text,
and `dims: 2048` for the current Nemotron model. Run the same command with `--resume`; unchanged
documents should be reported as skipped and retain their original `generated_at`.

Atlas vector-search index creation and the search/ranking code belong to the retrieval change, not
this pipeline PR.
