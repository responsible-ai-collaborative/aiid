# OECD Import

## Overview

The script converts AIID matches export JSON files into structured relationship data that links AIID incidents to corresponding OECD incident entries. The generated data is then imported into the database via migrations.

**Key Files:**
- Script: `src/scripts/import-oecd-relationships.ts`
- Migration: `migrations/2025.05.20T12.00.00.import-oecd-relationships.ts`
- Generated data: `migrations/data/oecd_relationships.json`

## Prerequisites

Access to the OECD repository is required to obtain the `matches.json` file containing the AIID matches export data. This file must be downloaded and placed in the project directory before running the import script.

## Usage

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

### Generate New Migration

To create a new migration file:

```bash
npm run db:migrator -- create --name new-migration-importing-generated-oecd-json.ts
```

Look at [2025.05.20T12.00.00.import-oecd-relationships.ts](../gatsby-site//migrations/2025.05.20T12.00.00.import-oecd-relationships.ts) for an example.

### Run Migration

After generating the relationships file, import the data to the database:

```bash
npm run db:migrator -- up
```

If the migration succeeds the new data should be in the database and restarting the development server should show the new OECD matches.