# Incident Embeddings

This directory holds the embedding pipeline: a batch job that turns every incident into a
single vector and stores it in MongoDB, so incidents can be compared by meaning rather
than by keyword.

An incident document has no article body of its own, only a `title`. The text worth
embedding lives on its reports, reached through the `incidents.reports` array of
`report_number` join keys. The pipeline joins the two, embeds the result, and writes one
document per incident to `aiidprod.incident_embeddings`.

This is separate from the per-report embeddings the site already uses for the
"Most Semantically Similar Incidents" panel. Those are generated at submission time and
stored on each report. These are generated in bulk, for the whole corpus, from a model
that is configured entirely through environment variables.

## What It Does

For each incident:

1. Reads the incident and every report it links to.
2. Joins the title and the report bodies into one string, with reports sorted by
   `report_number` so the same incident produces byte-identical input on every run.
3. Splits that string into chunks at paragraph boundaries if it exceeds the character
   budget. At the default budget about 44% of incidents fit in a single chunk, and the
   whole corpus of roughly 1,550 incidents becomes roughly 4,600 chunks.
4. Sends all chunks in one request. The API accepts an array and returns one embedding
   per element, so a chunked incident is still a single call.
5. Averages the chunk vectors component-wise and normalises the result to unit length.
   This is the same pooling that `server/fields/common.ts:incidentEmbedding` performs
   when it combines sibling report vectors.
6. Upserts the vector into `incident_embeddings`, keyed on `incident_id`.

Every incident is written the moment it completes, so an interrupted run keeps everything
it had already finished.

## Key Files

| File | What it contains |
|---|---|
| `src/scripts/embed-incidents.ts` | Serves as the entry point and orchestration. Selects the incidents to process, fetches their reports, requests a vector for each, writes the results, and prints the progress and summary output. Also handles early stops from a signal or from repeated failures. |
| `src/utils/embeddings/provider.ts` | HTTP client for the embedding endpoint. Builds and sends the request, validates the response shape, and retries with growing delays on transient errors. Holds every vendor-specific detail. |
| `src/utils/embeddings/incidentText.ts` | Text and vector helpers. `buildIncidentText` joins a title and its report bodies into one string, `chunkText` splits text longer than the model accepts, and `poolVectors` averages chunk vectors into a single vector. |
| `.github/workflows/embed-incidents.yml` | GitHub Action definition. Declares the dispatch inputs, installs Node and the project dependencies, runs the script with the configured secrets, and uploads the failure manifest. |

## Running It Locally

You need a MongoDB with incident data and an API key for the embedding endpoint. Put both
in `site/gatsby-site/.env`:

```bash
MONGODB_CONNECTION_STRING=mongodb://127.0.0.1:4110
EMBEDDING_API_KEY=your-key-here
```

Then, from `site/gatsby-site`:

```bash
npm run embed-incidents -- --limit 5      # small live test
npm run embed-incidents -- --incident-id 1 --incident-id 2
npm run embed-incidents                   # the whole corpus
npm run embed-incidents -- --resume       # skip what is already embedded
```

There are only three options, because everything else is configuration rather than a
choice you make per run:

| Option | Effect |
|---|---|
| `--limit N` | Process at most the first N incidents. |
| `--incident-id N` | Only these incidents. Repeatable. |
| `--resume` | Skip incidents already embedded with the current model. |

A full run of roughly 1,550 incidents takes about three and a half minutes at a
concurrency of 3.

## Running It From GitHub Actions

The workflow is **Embed Incidents** (`.github/workflows/embed-incidents.yml`). It is
triggered manually: open the Actions tab, select the workflow, and choose "Run workflow".

| Field | Required | Notes |
|---|---|---|
| `environment` | Yes | Which GitHub environment to load secrets and variables from, and therefore **which database gets written to**. It must name an environment that already exists under Settings, Environments. There is no default, so that the target database is always an explicit choice. |
| `limit` | No | Process at most this many incidents. Blank means all. |
| `resume` | No | Tick to skip incidents already embedded with the current model. |

The job checks out the repo, installs Node LTS and dependencies, and runs the script. It
allows up to 300 minutes, because a free-tier endpoint under rate limiting can stretch a
full run, and every incident is checkpointed so a timeout is always recoverable.

Whether the run passes or fails, the job uploads `embed-failures.json` as an artifact
named `embed-failures` if the script produced one. If a run fails, download that artifact
to see which incidents failed and why, then re-run with `resume` ticked.

If you have not run this workflow before, follow
[Testing The Workflow](#testing-the-workflow) below, which covers the setup that a first
run needs and how to confirm it worked.

## Testing The Workflow

### Before the first run

1. **The workflow file must be on the default branch.** GitHub only shows a "Run workflow"
   button for `workflow_dispatch` workflows that exist on the repository default branch,
   which is `main` here. Once it is there you can still target any branch from the branch
   selector, but until then the workflow does not appear in the Actions tab at all.
2. **Create a GitHub environment** under Settings, Environments. The `environment` input
   has no default, so it must name one that exists. Point the first one at a test database
   rather than production.
3. **Add `MONGODB_CONNECTION_STRING`** as a secret on that environment. The user needs the
   `readWrite` role on `aiidprod`, because the script creates a unique index and upserts
   documents. A read-only user is enough for some other pipelines in this repo but not for
   this one.
4. **Add `EMBEDDING_API_KEY`** as a secret on the same environment.
5. **Allow the runner through your database firewall.** GitHub-hosted runners have dynamic
   addresses, so an Atlas cluster needs `0.0.0.0/0` under Network Access or an allowlist
   built from GitHub's published IP ranges. A run that hangs and then times out while
   connecting is nearly always this.
6. Everything else is optional. Every remaining setting has a working default.

### The first run

Run the workflow with `environment` set to your test environment, `limit` set to `5`, and
`resume` unticked. Five incidents exercises the whole path, including chunking and the
database write, and spends five requests.

### What a healthy log looks like

```
------------------------------------------------------------------------
base url    https://openrouter.ai/api/v1
model       nvidia/nemotron-3-embed-1b:free
writing to  aiidprod.incident_embeddings
limits      max_input_chars=8000 timeout=2m00s max_attempts=6
concurrency 2
incidents   5
------------------------------------------------------------------------
[1/5] incident 1 ok chunks=10 chars=72787 dims=2048 attempts=1 1.2s
[2/5] incident 2 ok chunks=7 chars=48196 dims=2048 attempts=1 0.9s
...
------------------------------------------------------------------------
succeeded   5/5
failed      0
retried     0
chunked     5 incident(s), 43 chunk(s) total
wall time   6.1s
latency     avg=1.1s
------------------------------------------------------------------------
```

Three things are worth reading before anything else. The banner confirms which endpoint,
model and collection the run actually used, so it catches a misconfigured setting straight
away. Every incident line should report `dims=2048`, since a different number means the
model changed. The summary should show `succeeded 5/5` with `failed 0`, and the job exits
non-zero if anything failed.

### Confirming the vectors landed

Connect to the test database with mongosh or Compass and check the three things the log
cannot prove:

```js
use aiidprod

// One document per incident, so five after the first run.
db.incident_embeddings.countDocuments()

// Stored metadata should match the banner from the log.
db.incident_embeddings.findOne({}, { vector: 0 })

// Vectors are normalised, so this is 1 give or take floating point error.
const v = db.incident_embeddings.findOne({}, { vector: 1 }).vector
Math.sqrt(v.reduce((sum, x) => sum + x * x, 0))
```

Then run the workflow a second time with the same `limit` of 5. The count should still be
5, because writes are upserts keyed on `incident_id`, and `generated_at` should have moved
forward. That confirms a re-run overwrites cleanly and cannot accumulate duplicates.

### When it fails

Read the last few log lines first, because the script prints the reason it stopped and the
command to resume. Download the `embed-failures` artifact from the run summary for the
per-incident detail, then re-run with `resume` ticked once the cause is fixed.

| Symptom | Cause |
|---|---|
| `MONGODB_CONNECTION_STRING is required` | The secret is not set on the environment you selected |
| Hangs, then times out while connecting | The database firewall does not allow the runner |
| `not authorized on aiidprod` | The database user lacks the `readWrite` role |
| `EMBEDDING_API_KEY is required` | The secret is not set on the environment you selected |
| `Rate limit exceeded: free-models-per-day` | The free tier daily ceiling, which resets at midnight UTC |
| `base url ***` or `model ***` in the banner | That setting was stored as a secret, so GitHub masked it |

## Configuration

Everything is set through the environment. Locally that means `.env`; in CI it means
secrets and variables on the GitHub environment named by the `environment` input.

| Name | Type | Default | Purpose |
|---|---|---|---|
| `MONGODB_CONNECTION_STRING` | secret | none, required | Read and write access to the `aiidprod` database. |
| `EMBEDDING_API_KEY` | secret | none, required | Bearer token for the embedding endpoint. |
| `EMBEDDING_API_BASE_URL` | variable or secret | `https://openrouter.ai/api/v1` | Base URL of an OpenAI-compatible embeddings API. |
| `EMBEDDING_MODEL` | variable or secret | `nvidia/nemotron-3-embed-1b:free` | Model identifier, passed straight through. |
| `EMBEDDING_MAX_INPUT_CHARS` | variable or secret | `8000` | Chunk size in characters. See the note below. |
| `EMBEDDING_CONCURRENCY` | variable or secret | `2` | Incidents embedded in parallel. This is the main pacing control against a rate-limited endpoint. |
| `EMBEDDING_TIMEOUT_MS` | variable or secret | `120000` | Per-request timeout. |
| `EMBEDDING_MAX_ATTEMPTS` | variable or secret | `6` | Attempts per request before giving up on an incident. |

The defaults are the settings that work against the current model, so a run needs nothing
but the two secrets.

The two credentials must be secrets. The other six are read from a repository or
environment variable first and a secret second, so either place works. Setting one as a
secret means GitHub masks it, and the startup banner then prints `model ***` instead of the
model name, which costs you the clearest signal that a run picked up the config you meant.

`EMBEDDING_MAX_INPUT_CHARS` is worth understanding before changing it. The real limit is
in tokens, not characters, and the ratio varies from roughly 4 characters per token for
Latin prose to close to 1 for Chinese or Japanese. The default of 8,000 is deliberately
conservative for a 4,096-token model. If the server rejects a request as too long anyway,
the script reads the token counts out of the error and re-chunks that incident at a
smaller budget, up to three times, rather than failing it.

## What Gets Stored

One document per incident in `aiidprod.incident_embeddings`, with a unique index on
`incident_id`:

```js
{
  incident_id: 1,
  vector: [0.0143, -0.0271, ...],            // 2048 floats, unit length
  dims: 2048,
  model: 'nvidia/nemotron-3-embed-1b:free',
  base_url: 'https://openrouter.ai/api/v1',
  chunks: 10,                                 // chunks pooled into this vector
  source_chars: 72787,                        // length of the joined text
  generated_at: ISODate('2026-08-25T16:18:07Z')
}
```

Writes are upserts keyed on `incident_id`, so re-running never duplicates a row. `model`
is what `--resume` compares against, which means changing the model correctly causes a
resumed run to re-embed everything.

## Failure Handling

The endpoint may be free-tier, rate limited, and slow, so the script assumes failure is
normal:

- **Retries.** 408, 425, 429, 500, 502, 503 and 504 are retried with exponential backoff
  and jitter. A `Retry-After` header is honoured up to a 60-second ceiling. Anything else
  fails immediately with the response body attached, because retrying a request the
  server has rejected only wastes minutes and buries the real error.
- **Checkpointing.** Each incident is written as soon as it succeeds. Nothing is batched
  or held until the end.
- **Quota exhaustion.** If the server asks for a `Retry-After` longer than the ceiling,
  the run stops rather than sleeping. Finished work is already stored, so coming back
  later with `--resume` is cheaper than waiting.
- **Circuit breaker.** Ten consecutive failures stop the run, so a broken key or a dead
  endpoint does not work through the whole corpus to rediscover the same error.
- **Interruption.** `SIGINT` and `SIGTERM` let in-flight requests finish, then stop and
  print the summary. A second Ctrl-C kills the process outright.
- **Failure manifest.** Any failure is appended to `embed-failures.json` and the file is
  rewritten immediately, so even a hard kill leaves the list behind.

Recovery is always the same command, which the script prints for you:

```bash
npm run embed-incidents -- --resume
```

Anything that failed was never stored, so a resumed run retries it as a matter of course.

| Exit code | Meaning |
|---|---|
| `0` | Every incident succeeded. |
| `1` | At least one incident failed, or the run stopped early. |
| `130` | Interrupted by a signal. |

## Changing The Model Or Provider

Set `EMBEDDING_MODEL`. If the new model lives somewhere else, set
`EMBEDDING_API_BASE_URL` too. No code changes are needed for any endpoint that speaks the
OpenAI embeddings shape:

```
POST {baseUrl}/embeddings  {model, input}  ->  {data: [{embedding, index}]}
```

Check `EMBEDDING_MAX_INPUT_CHARS` against the new model's token limit, and expect the
next run to re-embed the whole corpus, since `--resume` keys on the model name. Vectors
of different dimensions are stored side by side without complaint, so compare only
vectors that share a `model` value.
