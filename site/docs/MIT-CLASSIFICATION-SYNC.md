# MIT Classification Sync

## Overview

The MIT taxonomy classifications are refreshed automatically from the [Arcola AI](https://platform.arcolaai.com/) platform, which classifies every incident with the MIT AI Risk Repository taxonomy. The sync runs as the second job of the [daily backup workflow](/.github/workflows/db-daily-backup.yml), only after the backup succeeded, so a snapshot from before any change always exists. It can also be run by hand from the [Sync MIT classifications](/.github/workflows/sync-mit-classifications.yml) workflow.

The sync is a dry run unless the environment's `MIT_SYNC_DRY_RUN` variable is `false`. A dry run fetches the export, plans every write, applies every rule below and reports the result in the job log, but writes nothing.

**Key files:**
- Script: `src/scripts/mitClassificationsSync.ts` (rules and planning), `src/scripts/syncMitClassifications.ts` (entry point)
- NPM scripts: `sync-mit-classifications` (reads `.env`) and `sync-mit-classifications:ci`
- Workflow: `.github/workflows/sync-mit-classifications.yml`, called from `.github/workflows/db-daily-backup.yml`
- Migrations: `migrations/2026.11.03T12.00.00.add-mit-arcola-fields.ts`, `migrations/2026.11.08T12.00.00.add-mit-revision-fields.ts`
- Tests: `playwright/e2e/unit/mitClassificationsSync.spec.ts`, `server/tests/migrations/2026.11.03T12.00.00.add-mit-arcola-fields.spec.ts`, `server/tests/migrations/2026.11.08T12.00.00.add-mit-revision-fields.spec.ts`

## Source

One request per run:

```
GET https://platform.arcolaai.com/api/v1/aiid/export?classified_only=true&latest_only=true&limit=10000
X-API-Key: <ARCOLA_API_KEY>
```

The response is a CSV with one row per incident holding its latest classification (`latest_only=true` picks the row with the highest revision; without it there is one row per classification of each incident). Columns are read by name, never by position, since Arcola only ever appends columns. The run fails if any column below is missing, if an incident appears twice, or if the row count reaches the `limit` parameter. The API reference is at https://platform.arcolaai.com/api/docs (version 1.1.0 added `revision` and `human_corrected`); keys are rate-limited to 60 requests per minute.

| Taxonomy field | Export column | Kind |
|---|---|---|
| Risk Domain | `domain_code` | permitted value, matched by numeric code |
| Risk Subdomain | `subdomain_code` | permitted value, matched by numeric code |
| Entity | `causal_entity` | permitted value, exact |
| Timing | `causal_timing` | permitted value, exact |
| Intent | `causal_intent` | permitted value, exact |
| Additional Subdomains | `additional_subdomains` | JSON list of `{ code, justification }`; the codes are stored, matched like subdomains |
| Prompt Version | `prompt_version` | free text, must not be empty |
| Revision | `revision` | whole number from 1; stored as a JSON number |
| Human Corrected | `human_corrected` | `true` or `false`; stored as a JSON boolean |

Arcola's labels differ from the taxonomy's by punctuation (`4 Malicious actors` against `4. Malicious Actors & Misuse`), which is why domains and subdomains are matched by their leading number. The justification of each additional subdomain is not stored.

`revision` counts the classifications of an incident: 1 for the first, one higher for each later one. Arcola gives a re-classification a new revision whatever caused it: a new prompt version, a different model, or a person setting a value (which also sets `human_corrected` to `true`). An incident can therefore be re-classified under the same prompt version; in the export of 8 November 2026, 263 incidents have two revisions under `aiid.v2`. `human_corrected` is `false` on every row so far.

## Rules

Each rule is checked before anything is written, and any failure aborts the whole run with a non-zero exit, in a dry run as well as a real one:

1. **Every value must map onto a permitted value of the taxonomy.** When Arcola starts using a label the taxonomy lacks, add it to the taxonomy with a migration (as `2026.11.03T12.00.00.add-mit-arcola-fields.ts` did for `7.6. Multi-agent risks`), then run again.
2. **A stored classification only changes when the export carries a higher revision for it.** The revision is stored with every classification. When the export's revision is higher than the stored one, every changed field is written, including the revision itself, even when nothing else changed. When the revisions are equal, every value must be equal too: a changed value under the stored revision (any field, including Prompt Version and Human Corrected) means the pipeline is broken. A revision lower than the stored one cannot happen under Arcola's numbering and also means the pipeline is broken. In both cases the run reports every such incident and writes nothing. Classifications without a stored revision (everything imported before the sync existed) are brought up to date on the first real run.
3. **A run may not write more than `MIT_SYNC_MAX_FIELD_UPDATES` field values** (default 500). Every field of a new classification and every changed field of an updated one counts. A day's worth of new incidents is a few dozen; a re-classification of the whole corpus under a new prompt version is thousands, and has to be allowed on purpose by raising the limit for that run.

Rows whose incident does not exist in `aiidprod.incidents` are skipped and listed in the log. An incident holding more than one MIT classification aborts the run until the duplicate is removed. Classifications are never deleted by the sync.

Rule 2 also covers edits made in the AIID classification editor: changing a value of an MIT classification there without changing its Revision makes the next run abort, naming the incident, until the edit is reverted or Arcola publishes a new revision for it. Corrections belong on the Arcola platform, where they produce a new revision that the sync then picks up.

Writes are an ordered `bulkWrite`: an insert per new classification (`namespace: MIT`, `publish: true`, the nine fields above) and an update of the `attributes` of each changed one, which keeps any attribute the sync does not manage.

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

The log starts with a summary of the export (`Arcola export: R rows; prompt versions aiid.v2=…; revisions 1=…, 2=…; H human-corrected`), then a plan summary of the form `Plan: N classifications to create, M to update, K unchanged; F field values to write (limit L)`, followed by up to twenty of the planned creates and updates with each changed value, and up to fifty violations when there are any.

## Turning writes on

1. Deploy the migrations (they run with the other migrations on deploy) and add `ARCOLA_API_KEY` to the environment. The next daily run is a dry run; read its log.
2. The first real run brings every existing classification up to date, since none of them carries a revision yet. Expect it to update every existing MIT classification and create one for every incident without one, which is far above the default limit (a dry run of the 8 November 2026 export against the 2 November production snapshot planned 1,497 updates and 288 creates, 9,336 field values). Run the manual workflow once with `dry_run` = `false` and `max_field_updates` set above the field value count the dry run reported.
3. Set `MIT_SYNC_DRY_RUN` to `false` in the environment so the daily run writes from then on. Leave `MIT_SYNC_MAX_FIELD_UPDATES` at its default; raise it only for a run you expect to be large.

## Taxonomy fields

Two migrations add four fields to the MIT taxonomy, which the [taxonomy page](https://incidentdatabase.ai/taxonomies/mit) lists with their descriptions and the incident pages show with the other MIT values.

`2026.11.03T12.00.00.add-mit-arcola-fields.ts`:

- **Additional Subdomains** (`multi`, searchable in Discover): the further subdomains the classifier found to apply, with the same permitted values as Risk Subdomain.
- **Prompt Version** (`string`): the classifier prompt version that produced the classification.

It also adds `7.6. Multi-agent risks` to the subdomain lists, which the classifier uses and the taxonomy lacked, and a paragraph on the automated refresh to the taxonomy description.

`2026.11.08T12.00.00.add-mit-revision-fields.ts`:

- **Revision** (`int`, hidden from Discover search like the other bookkeeping fields): the revision of the classification, 1 for the first, one higher for each re-classification. The sync's change rule is keyed on it.
- **Human Corrected** (`bool`, shown as Yes or No on incident pages): whether a person set any of the classification's values on the Arcola platform. Discover indexes only `true` values of boolean fields, so it is not a facet either.

The taxonomy page lists both new fields with their descriptions; neither is an instant facet, so neither gets a chart there.

It also rewrites the Prompt Version description and the taxonomy description's paragraph on the automated refresh, which said that a classification only changes with a new prompt version, to describe the revision rule instead. A description someone has edited by hand is left alone (the paragraph is appended once). Both migrations are idempotent and have a `down`. The end-to-end seed in `playwright/seeds/aiidprod/taxa.ts` matches the taxonomy after both, which `mitClassificationsSync.spec.ts` checks.

The CSV importer described in [MIT-CLASSIFICATION-IMPORT.md](MIT-CLASSIFICATION-IMPORT.md) still works for one-off imports, but anything it writes to the MIT namespace without a Revision will be overwritten by the sync's next run, and anything it writes with the stored Revision but different values will make the sync abort (rule 2).
