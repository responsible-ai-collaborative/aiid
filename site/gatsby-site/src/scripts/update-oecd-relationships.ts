/**
 * Updates OECD incident relationships in the `incident_links` collection from the
 * latest matches.json in the private oecd-ai-org/AIM-AIID-Matches repository.
 *
 * Usage: npm run update-oecd-relationships [-- --inputFile=PATH_TO_MATCHES_JSON]
 *
 * When --inputFile is omitted, matches.json is downloaded from GitHub using
 * OECD_MATCHES_GITHUB_TOKEN (a token with read access to oecd-ai-org/AIM-AIID-Matches).
 *
 * Environment variables:
 * - API_MONGODB_CONNECTION_STRING: connection string of the database to update (required)
 * - OECD_MATCHES_GITHUB_TOKEN: GitHub token for downloading matches.json (required unless --inputFile is passed)
 * - OECD_UPDATE_MAX_NEW: maximum number of new relationships allowed per run (default 50);
 *   the script aborts without writing when the threshold is exceeded
 * - DRY_RUN: set to "true" to preview changes without writing
 *
 * Relationships never present are inserted; existing relationships are left untouched.
 * Nothing is ever deleted — relationships that disappear upstream are only reported.
 */

import fs from 'fs';
import { MongoClient } from 'mongodb';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import {
  AiidMatchEntry,
  IncidentRelationship,
  processMatchesJson,
} from './generate-oecd-relationships';

const MATCHES_REPO = 'oecd-ai-org/AIM-AIID-Matches';

const MATCHES_FILE_PATH = 'matches.json';

const DB_NAME = 'aiidprod';

const DRY_RUN = process.env.DRY_RUN === 'true';

const MAX_NEW_RELATIONSHIPS = parseInt(process.env.OECD_UPDATE_MAX_NEW || '50', 10);

const relationshipKey = (r: { incident_id: number; sameAs: string; source_namespace: string }) =>
  `${r.incident_id}|${r.sameAs}|${r.source_namespace}`;

async function downloadMatches(): Promise<AiidMatchEntry[]> {
  const token = process.env.OECD_MATCHES_GITHUB_TOKEN;

  if (!token) {
    throw new Error('OECD_MATCHES_GITHUB_TOKEN is required when --inputFile is not provided');
  }

  const url = `https://api.github.com/repos/${MATCHES_REPO}/contents/${MATCHES_FILE_PATH}`;

  console.log(`Downloading ${MATCHES_FILE_PATH} from ${MATCHES_REPO}...`);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      // matches.json exceeds the 1MB limit of the default contents response,
      // so the raw media type is required
      Accept: 'application/vnd.github.raw',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download matches.json: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function validateRelationships(relationships: IncidentRelationship[]): void {
  if (relationships.length === 0) {
    throw new Error('No relationships were generated from matches.json - aborting');
  }

  for (const r of relationships) {
    const valid =
      Number.isInteger(r.incident_id) &&
      r.incident_id > 0 &&
      typeof r.sameAs === 'string' &&
      r.sameAs.startsWith('https://oecd.ai/en/incidents/') &&
      r.source_namespace === 'OECD';

    if (!valid) {
      throw new Error(`Generated relationship failed validation: ${JSON.stringify(r)}`);
    }
  }
}

async function main(): Promise<void> {
  const args = yargs(hideBin(process.argv))
    .option('inputFile', {
      description: 'Optional path to a local matches.json (skips the GitHub download)',
      type: 'string',
    })
    .parseSync();

  const connectionString = process.env.API_MONGODB_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error('API_MONGODB_CONNECTION_STRING is required');
  }

  console.log(`Running in ${DRY_RUN ? 'DRY RUN' : 'LIVE'} mode`);

  const matches: AiidMatchEntry[] = args.inputFile
    ? JSON.parse(fs.readFileSync(args.inputFile, 'utf-8'))
    : await downloadMatches();

  console.log(`Processing ${matches.length} match entries...`);

  const relationships = processMatchesJson(matches);

  validateRelationships(relationships);

  console.log(`Generated ${relationships.length} relationships`);

  const client = new MongoClient(connectionString);

  try {
    await client.connect();

    const collection = client.db(DB_NAME).collection('incident_links');

    const existing = await collection.find({ source_namespace: 'OECD' }).toArray();

    const existingKeys = new Set(existing.map((r: any) => relationshipKey(r)));

    console.log(`Found ${existingKeys.size} existing OECD relationships in the database`);

    // Sanity check: a drastically smaller upstream file most likely means the
    // export is broken or truncated, not that matches were legitimately removed
    if (relationships.length < existingKeys.size * 0.5) {
      throw new Error(
        `Generated relationship count (${relationships.length}) is less than half the existing count (${existingKeys.size}) - upstream data looks wrong, aborting`
      );
    }

    const generatedKeys = new Set(relationships.map(relationshipKey));

    const removedUpstream = [...existingKeys].filter((k) => !generatedKeys.has(k));

    if (removedUpstream.length > 0) {
      console.warn(
        `Warning: ${removedUpstream.length} existing relationships are no longer present upstream (they will NOT be deleted):`
      );
      removedUpstream.forEach((k) => console.warn(`  ${k}`));
    }

    const newRelationships = relationships.filter((r) => !existingKeys.has(relationshipKey(r)));

    console.log(`${newRelationships.length} new relationships to insert`);

    newRelationships.forEach((r) => console.log(`  incident ${r.incident_id} -> ${r.sameAs}`));

    // Safety check: an unusually large batch of new relationships likely means
    // something changed upstream and a human should review before importing
    if (newRelationships.length > MAX_NEW_RELATIONSHIPS) {
      throw new Error(
        `Refusing to insert ${newRelationships.length} new relationships (limit: ${MAX_NEW_RELATIONSHIPS}). ` +
          `Review the changes and re-run with a higher OECD_UPDATE_MAX_NEW if they are expected.`
      );
    }

    if (DRY_RUN) {
      console.log('Dry run - no changes were written');
      return;
    }

    let upserted = 0;

    for (const relationship of newRelationships) {
      // Upsert on the unique key (incident_id, sameAs, source_namespace) so
      // concurrent or repeated runs cannot create duplicates
      const result = await collection.updateOne(
        {
          incident_id: relationship.incident_id,
          sameAs: relationship.sameAs,
          source_namespace: relationship.source_namespace,
        },
        { $setOnInsert: relationship },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        upserted += 1;
      }
    }

    console.log(`OECD relationships update completed: ${upserted} new relationships inserted`);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}
