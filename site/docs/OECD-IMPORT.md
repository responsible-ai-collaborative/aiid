# OECD Import

## Overview

The script converts AIID matches export JSON files into structured relationship data that links AIID incidents to corresponding OECD incident entries. The generated data is then imported into the database via migrations.

**Key Files:**
- Script: `src/scripts/generate-oecd-relationships.ts`
- Migration: `migrations/2025.05.20T12.00.00.import-oecd-relationships.ts`
- Generated data: `migrations/data/oecd_relationships.json`

## Automated Updates

The [Update OECD Relationships](../../.github/workflows/update-oecd-relationships.yml) GitHub Action keeps the `incident_links` collection up to date without requiring a migration. It runs weekly (Tuesdays at 12:00 UTC) against both staging and production, and can also be triggered manually via `workflow_dispatch` for a single environment (with an optional dry run).

Each run:

1. Downloads the latest `matches.json` from the private `oecd-ai-org/AIM-AIID-Matches` repository (via the `OECD_MATCHES_GITHUB_TOKEN` secret)
2. Converts it to relationships with the same logic as `generate-oecd-relationships.ts`
3. Inserts only relationships not already present, upserting on the unique key `(incident_id, sameAs, source_namespace)`; nothing is ever deleted

Runtime safety checks abort the run without writing when:

- More than `OECD_UPDATE_MAX_NEW` (default 50) new relationships would be inserted — large jumps should be reviewed by a human and imported via a migration or a manual run with a raised limit
- The generated relationship count is less than half of the existing count, which indicates a broken or truncated upstream export
- Any generated relationship fails shape validation

The underlying script can also be run locally:

```bash
npm run update-oecd-relationships -- --inputFile=matches.json
```

**Required secrets (per GitHub environment):**
- `API_MONGODB_CONNECTION_STRING`: the database to update (already configured for deploys)
- `OECD_MATCHES_GITHUB_TOKEN`: a GitHub token with read access to `oecd-ai-org/AIM-AIID-Matches`

## Manual Import via Migration

For bulk imports (e.g. when the automated update's safety threshold is exceeded), relationships can be imported through a migration as described below.

### Prerequisites

Access to the OECD private repository is required to obtain the `matches.json` file containing the AIID matches export data. This file must be downloaded and placed in the project directory before running the import script.

### Generate Relationships

```bash
npm run generate-oecd-relationships -- --inputFile=PATH_TO_JSON_FILE --outputFile=PATH_TO_OUTPUT_JSON
```

**Parameters:**
- `--inputFile`: Path to the AIID matches export JSON file
- `--outputFile`: Path where the relationship data will be saved

**Example:**
```bash
npm run generate-oecd-relationships -- --inputFile=matches.json --outputFile=migrations/data/oecd_relationships.json
```

### Create the Migration

To create a new migration file:

```bash
npm run db:migrator -- create --name new-migration-importing-generated-oecd-json.ts
```

Look at [2025.05.20T12.00.00.import-oecd-relationships.ts](../gatsby-site/migrations/2025.05.20T12.00.00.import-oecd-relationships.ts) for an example.

### Run Migration

After generating the relationships file, import the data to the database:

```bash
npm run db:migrator -- up
```

If the migration succeeds the new data should be in the database and restarting the development server should show the new OECD matches.