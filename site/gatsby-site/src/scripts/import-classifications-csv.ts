/**
 * A script for importing incident classifications from a CSV file into the MongoDB classifications collection.
 * 
 * Usage: npm run import-classifications-csv -- --csvFile=PATH_TO_CSV_FILE --namespace=YOUR_TAXONOMY_NAMESPACE --graphqlEndpoint=GRAPHQL_ENDPOINT --sessionToken=SESSION_TOKEN
 * 
 * The CSV should have columns matching the incident classification format, with the first column being the Incident ID.
 */

import fs from 'fs';
import { parse } from 'csv-parse/sync';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'cross-fetch';
import {
  ClassificationInsertType,
  AttributeInsertType,
  ClassificationFilterType,
  ClassificationIncidentsRelationInput,
  IntFilter
} from '../../server/generated/graphql';

interface CSVRow {
  [key: string]: string;
}

interface GraphQLResponse {
  data?: {
    upsertOneClassification?: {
      _id: string;
      namespace: string;
      incident_id: number;
    };
  };
  errors?: Array<{
    message: string;
    locations: Array<{
      line: number;
      column: number;
    }>;
    path: string[];
  }>;
}

interface CommandLineArgs {
  csvFile: string;
  namespace: string;
  dryRun: boolean;
  graphqlEndpoint: string;
  sessionToken: string;
}

function parseArgs(): CommandLineArgs {
  return yargs(hideBin(process.argv))
    .option('csvFile', {
      description: 'Path to the CSV file containing incident classifications',
      type: 'string',
      demandOption: true
    })
    .option('namespace', {
      description: 'The namespace for the taxonomy',
      type: 'string',
      demandOption: true
    })
    .option('dryRun', {
      description: 'Run without making changes to the database',
      type: 'boolean',
      default: false
    })
    .option('graphqlEndpoint', {
      description: 'GraphQL API endpoint',
      type: 'string',
      demandOption: true,
    })
    .option('sessionToken', {
      description: 'Next.js Auth session token for authentication (e.g., next-auth.session-token=token-value)',
      type: 'string',
      demandOption: true
    })
    .help()
    .alias('help', 'h')
    .parseSync() as CommandLineArgs;
}

function readCSVFile(filePath: string): CSVRow[] {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    return records;
  } catch (error) {
    console.error(`Error reading CSV file: ${(error as Error).message}`);
    throw error;
  }
}

function transformToClassificationsFormat(data: CSVRow[], namespace: string): ClassificationInsertType[] {
  return data.map(row => {

    const incidentId = parseInt(row['Incident ID'], 10);

    const attributes: AttributeInsertType[] = [];

    for (const [key, value] of Object.entries(row)) {
      if (key !== 'Incident ID' && value !== '') {
        attributes.push({
          short_name: key,
          value_json: JSON.stringify(value)
        });
      }
    }

    const classification: ClassificationInsertType = {
      namespace: namespace,
      incidents: {
        link: [incidentId]
      } as ClassificationIncidentsRelationInput,
      publish: true,
      notes: '',
      attributes: attributes
    };

    return classification;
  }).filter((item): item is ClassificationInsertType => item !== null); // Remove null entries (invalid incident IDs)
}

async function executeGraphQLMutation(
  endpoint: string,
  classification: ClassificationInsertType,
  sessionToken: string
): Promise<GraphQLResponse> {
  const mutation = `
    mutation UpsertOneClassification($filter: ClassificationFilterType!, $update: ClassificationInsertType!) {
      upsertOneClassification(filter: $filter, update: $update) {
        _id
        attributes {
          short_name
          value_json
        }
        incidents {
          incident_id
        }
        namespace
        notes
        publish
        reports {
          report_number
        }
      }
    }
  `;

  const incidentId = classification.incidents?.link[0] as number;

  const filter: ClassificationFilterType = {
    incidents: {
      EQ: incidentId
    } as IntFilter,
    namespace: {
      EQ: classification.namespace
    }
  };

  const variables = {
    filter,
    update: classification
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cookie': `next-auth.session-token=${encodeURIComponent(sessionToken)}`
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: mutation,
        variables
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`GraphQL request failed: ${error.message}`);
    throw error;
  }
}

function prepareClassificationsData(csvFile: string, namespace: string): ClassificationInsertType[] {

  console.log(`Reading data from CSV file: ${csvFile}...`);
  const data = readCSVFile(csvFile);
  console.log(`Read ${data.length} rows from the CSV file.`);

  const classifications = transformToClassificationsFormat(data, namespace);
  console.log(`Transformed ${classifications.length} classifications.`);

  return classifications;
}

function performDryRun(classifications: ClassificationInsertType[]): void {
  console.log('Dry run mode. No changes will be made to the database.');

  if (classifications.length === 0) {
    console.log('No classifications to process.');
    return;
  }

  console.log('Sample classification:');
  console.log(JSON.stringify(classifications[0], null, 2));
  console.log('\nSample GraphQL variables:');

  const incidentId = classifications[0].incidents?.link[0] as number;

  const sampleFilter: ClassificationFilterType = {
    incidents: {
      EQ: incidentId
    } as IntFilter,
    namespace: {
      EQ: classifications[0].namespace
    }
  };

  const sampleVariables = {
    filter: sampleFilter,
    update: classifications[0]
  };
  console.log(JSON.stringify(sampleVariables, null, 2));
}

async function importClassifications(
  classifications: ClassificationInsertType[],
  graphqlEndpoint: string,
  sessionToken: string
): Promise<void> {
  if (classifications.length === 0) {
    console.log('No classifications to process.');
    return;
  }

  console.log(`Processing ${classifications.length} classifications via GraphQL...`);
  let processed = 0;
  let errors = 0;

  for (const classification of classifications) {
    try {
      const incidentId = classification.incidents?.link[0];
      console.log(`Processing incident ID: ${incidentId}`);
      const response = await executeGraphQLMutation(graphqlEndpoint, classification, sessionToken);

      if (response.errors && response.errors.length > 0) {
        console.error(`GraphQL errors for incident ${incidentId}:`);
        response.errors.forEach(error => {
          console.error(`  - ${error.message}`);
        });
        errors++;
      } else if (!response.data || !response.data.upsertOneClassification) {
        console.error(`Unexpected GraphQL response for incident ${incidentId}:`, JSON.stringify(response));
        errors++;
      } else {
        console.log(`Successfully processed incident ID: ${incidentId} (ID: ${response.data.upsertOneClassification._id})`);
        processed++;
      }
    } catch (error: any) {
      const incidentId = classification.incidents?.link[0];
      console.error(`Error processing classification for incident ${incidentId}: ${error.message}`);
      errors++;
    }
  }

  console.log(`Import completed: ${processed} processed, ${errors} errors.`);
}

async function main(): Promise<void> {
  try {
    const args = parseArgs();

    const classifications = prepareClassificationsData(args.csvFile, args.namespace);

    if (args.dryRun) {
      performDryRun(classifications);
    } else {
      await importClassifications(classifications, args.graphqlEndpoint, args.sessionToken);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export {
  readCSVFile,
  transformToClassificationsFormat,
  executeGraphQLMutation,
  parseArgs,
  prepareClassificationsData,
  performDryRun,
  importClassifications as importClassificationsToDatabase,
  main
}; 