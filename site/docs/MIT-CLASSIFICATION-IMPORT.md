# MIT Classification Import

## Overview

The script imports incident classifications from CSV files into the AIID database using the MIT taxonomy framework. The tool validates data against taxonomy definitions and applies field/value mappings to transform CSV data into the proper format.

**Key Files:**
- Script: `src/scripts/import-classifications-csv.ts`
- Example mapping: `data/mit-mapping.json`
- NPM script: `import-classifications-csv` in `package.json`

## Prerequisites

Admin role with classification write permissions and a valid NextAuth.js session token are required. CSV file must have "Incident ID" as the first column with valid incident IDs.

## Usage

### Import Classifications

```bash
npm run import-classifications-csv -- --csvFile=PATH_TO_CSV --namespace=TAXONOMY_NAMESPACE --graphqlEndpoint=GRAPHQL_ENDPOINT --sessionToken=SESSION_TOKEN --mappingFile=PATH_TO_MAPPING_JSON
```

**Parameters:**
- `--csvFile`: Path to the CSV file containing incident classifications
- `--namespace`: Taxonomy namespace (e.g., "MIT")
- `--graphqlEndpoint`: GraphQL API endpoint URL
- `--sessionToken`: NextAuth.js session token for authentication
- `--mappingFile`: Path to the JSON mapping file
- `--dryRun`: Optional, run validation without making database changes

**Example (Dry Run):**
```bash
npm run import-classifications-csv -- --csvFile=data/mit-classifications.csv --namespace=MIT --graphqlEndpoint=http://localhost:8000/api/graphql --sessionToken=your-session-token-here --mappingFile=data/mit-mapping.json --dryRun
```

**Example (Import):**
```bash
npm run import-classifications-csv -- --csvFile=data/mit-classifications.csv --namespace=MIT --graphqlEndpoint=http://localhost:8000/api/graphql --sessionToken=your-session-token-here --mappingFile=data/mit-mapping.json
```

### Obtaining Session Token

Log into the AIID application with admin permissions, open browser developer tools → Network tab, make any authenticated request, and find the `__Secure-next-auth.session-token` or `next-auth.session-token` cookie value.

### Mapping File Format

The mapping file contains field mappings and value mappings. Look at [data/mit-mapping.json](../gatsby-site/data/mit-mapping.json) for a complete example.

Always run with `--dryRun` first to validate data and mappings before the actual import.