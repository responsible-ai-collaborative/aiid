# MIT Classification Sync

## Overview

The MIT taxonomy classifications are refreshed automatically from the [Arcola AI](https://platform.arcolaai.com/) platform, which classifies every incident with the MIT AI Risk Repository taxonomy. The sync runs as the second job of the [daily backup workflow](/.github/workflows/db-daily-backup.yml), only after the backup succeeded, so a snapshot from before any change always exists. It can also be run by hand from the [Sync MIT classifications](/.github/workflows/sync-mit-classifications.yml) workflow.

The sync is a dry run unless the environment's `MIT_SYNC_DRY_RUN` variable is `false`. A dry run fetches the export, plans every write, applies every rule below and reports the result in the job log, but writes nothing.

**Key files:**
- Script: `src/scripts/mitClassificationsSync.ts` (rules and planning), `src/scripts/syncMitClassifications.ts` (entry point)
- NPM scripts: `sync-mit-classifications` (reads `.env`) and `sync-mit-classifications:ci`
- Workflow: `.github/workflows/sync-mit-classifications.yml`, called from `.github/workflows/db-daily-backup.yml`
- Migration: `migrations/2026.11.03T12.00.00.add-mit-arcola-fields.ts`
- Tests: `playwright/e2e/unit/mitClassificationsSync.spec.ts`, `server/tests/migrations/2026.11.03T12.00.00.add-mit-arcola-fields.spec.ts`

## Source

One request per run:

```
GET https://platform.arcolaai.com/api/v1/aiid/export?classified_only=true&latest_only=true&limit=10000
X-API-Key: <ARCOLA_API_KEY>
```

The response is a CSV with one row per incident holding its latest classification (`latest_only=true`; without it there is one row per classifier generation). Columns are read by name, never by position, since Arcola only ever appends columns. The run fails if any column below is missing, if an incident appears twice, or if the row count reaches the `limit` parameter. The API reference is at https://platform.arcolaai.com/api/docs; keys are rate-limited to 60 requests per minute.

| Taxonomy field | Export column | Kind |
|---|---|---|
| Risk Domain | `domain_code` | permitted value, matched by numeric code |
| Risk Subdomain | `subdomain_code` | permitted value, matched by numeric code |
| Entity | `causal_entity` | permitted value, exact |
| Timing | `causal_timing` | permitted value, exact |
| Intent | `causal_intent` | permitted value, exact |
| Additional Subdomains | `additional_subdomains` | JSON list of `{ code, justification }`; the codes are stored, matched like subdomains |
| Prompt Version | `prompt_version` | free text, must not be empty |

Arcola's labels differ from the taxonomy's by punctuation (`4 Malicious actors` against `4. Malicious Actors & Misuse`), which is why domains and subdomains are matched by their leading number. The justification of each additional subdomain is not stored.

## Rules

Each rule is checked before anything is written, and any failure aborts the whole run with a non-zero exit, in a dry run as well as a real one:

1. **Every value must map onto a permitted value of the taxonomy.** When Arcola starts using a label the taxonomy lacks, add it to the taxonomy with a migration (as `2026.11.03T12.00.00.add-mit-arcola-fields.ts` did for `7.6. Multi-agent risks`), then run again.
2. **A stored classification only changes when its prompt version changes.** The classifier's prompt version is stored with every classification. If the export carries different values for an incident under the prompt version already stored, the classifier is not deterministic or the pipeline is broken; the run reports every such incident and writes nothing. Classifications imported before the sync existed have no prompt version, so they are brought up to date on the first real run.
3. **A run may not write more than `MIT_SYNC_MAX_FIELD_UPDATES` field values** (default 500). Every field of a new classification and every changed field of an updated one counts. A day's worth of new incidents is a few dozen; a re-classification of the whole corpus under a new prompt version is thousands, and has to be allowed on purpose by raising the limit for that run.

Rows whose incident does not exist in `aiidprod.incidents` are skipped and listed in the log. An incident holding more than one MIT classification aborts the run until the duplicate is removed. Classifications are never deleted by the sync.

Writes are an ordered `bulkWrite`: an insert per new classification (`namespace: MIT`, `publish: true`, the seven fields above) and an update of the `attributes` of each changed one, which keeps any attribute the sync does not manage.

## Configuration

Secrets, per GitHub environment:

| Secret | Purpose |
|---|---|
| `ARCOLA_API_KEY` | The Arcola API key. Keys expire 90 days after issue; both the old and the new key work during the overlap, so replacing the secret before the expiry date is a zero-downtime swap. |
| `API_MONGODB_CONNECTION_STRING` | Read/write connection to the database (already defined for the API). |

Variables, per GitHub environment:

| Variable | Default | Purpose |
|---|---|---|
| `MIT_SYNC_DRY_RUN` | unset, which means dry run | Set to `false` to let the scheduled run write. Anything else is a dry run. |
| `MIT_SYNC_MAX_FIELD_UPDATES` | `500` | Field values above which a run refuses to write. |

The manual workflow takes `dry_run` and `max_field_updates` inputs that override the variables for that run only. `ARCOLA_EXPORT_URL` replaces the export URL when set, which is useful against a test tenant.

## Running by hand

From the Actions tab, run **Sync MIT classifications** with the environment, `dry_run` and, if needed, `max_field_updates`. Locally, with `API_MONGODB_CONNECTION_STRING` in `.env`:

```bash
ARCOLA_API_KEY=... MIT_SYNC_DRY_RUN=true npm run sync-mit-classifications
```

The log ends with a plan summary of the form `Plan: N classifications to create, M to update, K unchanged; F field values to write (limit L)`, followed by up to twenty of the planned creates and updates with each changed value, and every violation when there is one.

## Turning writes on

1. Deploy the migration (it runs with the other migrations on deploy) and add `ARCOLA_API_KEY` to the environment. The next daily run is a dry run; read its log.
2. The first real run brings every existing classification up to date, since none of them carries a prompt version yet. Expect it to update every existing MIT classification and create one for every incident without one, which is far above the default limit. Run the manual workflow once with `dry_run` = `false` and `max_field_updates` set above the field value count the dry run reported.
3. Set `MIT_SYNC_DRY_RUN` to `false` in the environment so the daily run writes from then on. Leave `MIT_SYNC_MAX_FIELD_UPDATES` at its default; raise it only for a run you expect to be large.

## Taxonomy fields

The migration `2026.11.03T12.00.00.add-mit-arcola-fields.ts` adds two fields to the MIT taxonomy and shows them on the [taxonomy page](https://incidentdatabase.ai/taxonomies/mit):

- **Additional Subdomains** (`multi`, searchable in Discover): the further subdomains the classifier found to apply, with the same permitted values as Risk Subdomain.
- **Prompt Version** (`string`): the classifier prompt version that produced the classification.

It also adds `7.6. Multi-agent risks` to the subdomain lists, which the classifier uses and the taxonomy lacked, and a paragraph on the automated refresh to the taxonomy description. The end-to-end seed in `playwright/seeds/aiidprod/taxa.ts` carries the same fields.

The CSV importer described in [MIT-CLASSIFICATION-IMPORT.md](MIT-CLASSIFICATION-IMPORT.md) still works for one-off imports, but anything it writes to the MIT namespace will be overwritten by the sync at the next prompt version change.
