/**
 * A script for importing incident classifications from a CSV file into the MongoDB classifications collection.
 * 
 * Usage: npm run import-classifications-csv -- --csvFile=PATH_TO_CSV_FILE --namespace=YOUR_TAXONOMY_NAMESPACE --graphqlEndpoint=GRAPHQL_ENDPOINT --sessionToken=SESSION_TOKEN --mappingFile=PATH_TO_MAPPING_JSON
 * 
 * The CSV should have columns matching the incident classification format, with the first column being the Incident ID.
 * 
 * The mapping file should contain both field mappings and value mappings in the following format:
 * {
 *   "fieldMappings": {
 *     "Risk Domain": "Risk Domain",
 *     "Risk Subdomain": "Risk Subdomain",
 *     "Source Field Name": "Destination Field Name"
 *   },
 *   "valueMappings": {
 *     "Risk Domain": {
 *       "1 Discrimination & Toxicity": "1. Discrimination and Toxicity",
 *       "2 Privacy & Security": "2. Privacy & Security"
 *     },
 *     "Risk Subdomain": {
 *       "1.2 Exposure to toxic content": "1.2. Exposure to toxic content"
 *     }
 *   }
 * }
 * 
 * Both fieldMappings and valueMappings sections are required in the mapping file, though they can be empty objects.
 * 
 * The fieldMappings section contains a mapping of source field names to destination field names.
 * Fields not included in the mapping will not be imported.
 * 
 * The valueMappings section contains a mapping of field names to source-to-destination value mappings.
 * This is useful when the values in the CSV don't exactly match the permitted values in the taxonomy.
 */

import fs from 'fs';
import { parse } from 'csv-parse/sync';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'cross-fetch';
import ora from 'ora';
import chalk from 'chalk';
import {
  ClassificationInsertType,
  AttributeInsertType,
  ClassificationFilterType,
  ClassificationIncidentsRelationInput,
  IntFilter,
  ClassificationReportsRelationInput
} from '../../server/generated/graphql';

interface CSVRow {
  [key: string]: string;
}

interface FieldMapping {
  [sourceField: string]: string;
}

interface ValueMapping {
  [field: string]: {
    [sourceValue: string]: string;
  };
}

interface Mapping {
  fieldMappings: FieldMapping;
  valueMappings: ValueMapping;
}

// Base interface for GraphQL error responses
interface GraphQLErrorResponse {
  errors?: Array<{
    message: string;
    locations: Array<{
      line: number;
      column: number;
    }>;
    path: string[];
  }>;
}

// Interface for taxonomy query response
interface TaxonomyQueryResponse extends GraphQLErrorResponse {
  data?: {
    taxa?: {
      field_list?: TaxonomyField[];
    };
  };
}

// Interface for classification mutation response
interface ClassificationMutationResponse extends GraphQLErrorResponse {
  data?: {
    upsertOneClassification?: {
      _id: string;
      namespace: string;
      incident_id: number;
      attributes: {
        short_name: string;
        value_json: string;
      }[];
      incidents: {
        incident_id: number;
      }[];
      notes: string;
      publish: boolean;
      reports: {
        report_number: string;
      }[];
    };
  };
}

interface TaxonomyField {
  mongo_type: string;
  short_name: string;
  permitted_values?: string[];
}

interface CommandLineArgs {
  csvFile: string;
  namespace: string;
  dryRun: boolean;
  graphqlEndpoint: string;
  sessionToken: string;
  mappingFile: string;
}

// Helper function for console logging with better formatting
function logSection(title: string): void {
  console.log('\n' + chalk.blue('='.repeat(80)));
  console.log(chalk.blue(title));
  console.log(chalk.blue('='.repeat(80)));
}

function logWarning(message: string): void {
  console.warn(chalk.yellow(`\nWarning: ${message}`));
}

function logError(message: string): void {
  console.error(chalk.red(`\nError: ${message}`));
}

function logSuccess(message: string): void {
  console.log(chalk.green(`\n${message}`));
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
    .option('mappingFile', {
      description: 'Path to a JSON file containing field and value mappings',
      type: 'string',
      demandOption: true
    })
    .help()
    .alias('help', 'h')
    .parseSync() as CommandLineArgs;
}

function readCSVFile(filePath: string): CSVRow[] {
  try {
    console.log(`Reading CSV file: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    console.log(`Read ${records.length} rows from CSV file`);
    return records;
  }
  catch (error) {
    logError(`Error reading CSV file: ${(error as Error).message}`);
    throw error;
  }
}

function readMappingFile(filePath: string): Mapping {
  try {
    console.log(`Reading mapping file: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const mapping = JSON.parse(fileContent) as Mapping;

    // Validate the structure and ensure both sections are defined
    if (!mapping.fieldMappings) {
      logError(`Missing "fieldMappings" section in the mapping file: ${filePath}`);
      throw new Error(`Missing "fieldMappings" section in the mapping file: ${filePath}`);
    }

    if (!mapping.valueMappings) {
      logError(`Missing "valueMappings" section in the mapping file: ${filePath}`);
      throw new Error(`Missing "valueMappings" section in the mapping file: ${filePath}`);
    }

    // Check if they're empty objects and warn (but don't fail)
    if (Object.keys(mapping.fieldMappings).length === 0) {
      logWarning(`"fieldMappings" section is empty in the mapping file: ${filePath}`);
    }

    if (Object.keys(mapping.valueMappings).length === 0) {
      logWarning(`"valueMappings" section is empty in the mapping file: ${filePath}`);
    }

    console.log(`Loaded ${Object.keys(mapping.fieldMappings).length} field mappings and ${Object.keys(mapping.valueMappings).length} value mapping categories`);
    return mapping;
  }
  catch (error) {
    logError(`Error reading mapping file: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Executes a GraphQL query or mutation against the specified endpoint
 * @param endpoint The GraphQL endpoint URL
 * @param query The GraphQL query or mutation string
 * @param variables Variables to be passed to the GraphQL operation
 * @param sessionToken Authentication session token
 * @returns The GraphQL response
 */
async function executeGraphQLOperation<T extends GraphQLErrorResponse>(
  endpoint: string,
  query: string,
  variables: Record<string, any>,
  sessionToken: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cookie': `next-auth.session-token=${encodeURIComponent(sessionToken)}`
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors && result.errors.length > 0) {
      throw new Error(`GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`);
    }

    return result as T;
  }
  catch (error: any) {
    logError(`GraphQL operation failed: ${error.message}`);
    throw error;
  }
}

async function fetchTaxonomyDefinition(
  endpoint: string,
  namespace: string,
  sessionToken: string
): Promise<TaxonomyField[]> {
  const spinner = ora(`Fetching taxonomy definition for namespace: ${namespace}`).start();

  const query = `
    query GetTaxonomyDefinition($filter: TaxaFilterType!) {
      taxa(filter: $filter) {
        field_list {
          mongo_type
          short_name
          permitted_values
        }
      }
    }
  `;

  const variables = {
    filter: {
      namespace: {
        EQ: namespace
      }
    }
  };

  try {
    const result = await executeGraphQLOperation<TaxonomyQueryResponse>(
      endpoint,
      query,
      variables,
      sessionToken
    );

    if (!result.data?.taxa || !result.data.taxa.field_list || result.data.taxa.field_list.length === 0) {
      spinner.fail(`No taxonomy definition found for namespace: ${namespace}`);
      throw new Error(`No taxonomy definition found for namespace: ${namespace}`);
    }

    spinner.succeed(`Loaded ${result.data.taxa.field_list.length} taxonomy fields`);
    return result.data.taxa.field_list;
  }
  catch (error: any) {
    spinner.fail(`Error fetching taxonomy definition: ${error.message}`);
    throw error;
  }
}

function convertValueByMongoType(value: string, mongoType: string): any {
  switch (mongoType) {
    case 'String':
    case 'string':
      return value;
    default:
      throw new Error(`Unsupported mongo_type: ${mongoType}. Only string type is supported.`);
  }
}

function validateValueAgainstPermittedValues(
  value: any,
  permittedValues?: string[],
  valueMapping?: ValueMapping,
  fieldName?: string
): { isValid: boolean; mappedValue?: any } {
  if (!permittedValues || permittedValues.length === 0) {
    return { isValid: true, mappedValue: value }; // No validation needed
  }

  // Check if we have a mapping for this value
  if (valueMapping && fieldName && typeof value === 'string') {
    const fieldMappings = valueMapping[fieldName];
    if (fieldMappings && fieldMappings[value]) {
      const mappedValue = fieldMappings[value];
      // Check if the mapped value is valid
      if (permittedValues.includes(mappedValue)) {
        return { isValid: true, mappedValue };
      }
    }
  }

  // For arrays, check if all elements are in permitted values
  if (Array.isArray(value)) {
    const allValid = value.every(v => permittedValues.includes(String(v)));
    return { isValid: allValid, mappedValue: value };
  }

  // For other types, check if the value is in permitted values
  const isValid = permittedValues.includes(String(value));
  return { isValid, mappedValue: value };
}

function transformToClassificationsFormat(
  data: CSVRow[],
  namespace: string,
  fieldMapping: FieldMapping,
  taxonomyFields: TaxonomyField[],
  valueMapping?: ValueMapping
): ClassificationInsertType[] {
  const spinner = ora('Transforming data to classifications format...').start();

  // Create a map of field names to taxonomy field definitions for quick lookup
  const taxonomyFieldMap = new Map<string, TaxonomyField>();
  taxonomyFields.forEach(field => {
    taxonomyFieldMap.set(field.short_name, field);
  });

  // Track validation issues for summary reporting
  const validationIssues: Record<number, string[]> = {};
  let processedCount = 0;
  let skippedCount = 0;

  const classifications = data.map(row => {
    const incidentId = parseInt(row['Incident ID'], 10);

    if (isNaN(incidentId)) {
      logWarning(`Skipping row with invalid Incident ID: ${row['Incident ID']}`);
      skippedCount++;
      return null;
    }

    const attributes: AttributeInsertType[] = [];
    const invalidFields: string[] = [];

    // Apply field mapping
    for (const [sourceField, destinationField] of Object.entries(fieldMapping)) {
      if (sourceField in row && row[sourceField] !== '') {
        const taxonomyField = taxonomyFieldMap.get(destinationField);

        if (!taxonomyField) {
          const errorMsg = `Field "${destinationField}" not found in taxonomy definition for incident ID ${incidentId}.`;
          logWarning(errorMsg);
          invalidFields.push(`${destinationField} (not in taxonomy definition)`);
          continue;
        }

        // Convert value based on mongo_type
        const rawValue = row[sourceField];
        let convertedValue;
        try {
          convertedValue = convertValueByMongoType(rawValue, taxonomyField.mongo_type);
        }
        catch (error) {
          const errorMsg = `${(error as Error).message} Field: "${destinationField}" for incident ID ${incidentId}.`;
          logWarning(errorMsg);
          invalidFields.push(`${destinationField} (unsupported type: ${taxonomyField.mongo_type})`);
          continue;
        }

        // Validate against permitted values if available
        const validationResult = validateValueAgainstPermittedValues(convertedValue, taxonomyField.permitted_values, valueMapping, destinationField);
        if (!validationResult.isValid) {
          const errorMsg = `Value "${rawValue}" for field "${destinationField}" is not in the permitted values for incident ID ${incidentId}.`;
          logWarning(errorMsg);

          // Display all permitted values
          if (taxonomyField.permitted_values && taxonomyField.permitted_values.length > 0) {
            console.log(chalk.cyan(`  Valid options for "${destinationField}":`));
            taxonomyField.permitted_values.forEach((value, index) => {
              console.log(chalk.cyan(`    ${index + 1}. ${value}`));
            });
          }
          else {
            console.log(chalk.cyan('  No permitted values defined'));
          }

          invalidFields.push(`${destinationField} (value: ${rawValue})`);
          continue;
        }

        attributes.push({
          short_name: destinationField,
          value_json: JSON.stringify(validationResult.mappedValue)
        });
      }
    }

    // If any field has an invalid value, skip the entire classification
    if (invalidFields.length > 0) {
      validationIssues[incidentId] = invalidFields;
      logError(`Skipping entire classification for incident ID ${incidentId} due to ${invalidFields.length} invalid field(s)`);
      skippedCount++;
      return null;
    }

    processedCount++;
    const classification: ClassificationInsertType = {
      namespace: namespace,
      incidents: {
        link: [incidentId]
      } as ClassificationIncidentsRelationInput,
      reports: {
        link: []
      } as ClassificationReportsRelationInput,
      publish: true,
      notes: '',
      attributes: attributes
    };

    return classification;
  }).filter((item): item is ClassificationInsertType => item !== null);

  spinner.succeed(`Transformed ${classifications.length} classifications`);

  // Print summary of validation issues
  if (Object.keys(validationIssues).length > 0) {
    logSection('Validation Issues Summary');
    console.log(chalk.yellow(`${Object.keys(validationIssues).length} incidents had validation issues and were skipped:`));

    Object.entries(validationIssues).forEach(([incidentId, issues]) => {
      console.log(chalk.yellow(`  Incident ID ${incidentId}: ${issues.length} invalid field(s)`));
      issues.forEach(issue => {
        console.log(chalk.yellow(`    - ${issue}`));
      });
    });
  }

  logSection('Processing Summary');
  console.log(`Total rows in CSV: ${data.length}`);
  console.log(`Successfully processed: ${chalk.green(processedCount.toString())}`);
  console.log(`Skipped due to validation issues: ${chalk.yellow(skippedCount.toString())}`);

  return classifications;
}

async function executeGraphQLMutation(
  endpoint: string,
  classification: ClassificationInsertType,
  sessionToken: string
): Promise<ClassificationMutationResponse> {
  const incidentId = classification.incidents?.link[0] as number;
  const spinner = ora(`Processing incident ID: ${incidentId}`).start();

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

  try {
    const result = await executeGraphQLOperation<ClassificationMutationResponse>(
      endpoint,
      mutation,
      variables,
      sessionToken
    );

    if (result.errors && result.errors.length > 0) {
      spinner.fail(`GraphQL errors for incident ${incidentId}`);
      return result;
    }
    else if (!result.data || !result.data.upsertOneClassification) {
      spinner.fail(`Unexpected GraphQL response for incident ${incidentId}`);
      return result;
    }

    spinner.succeed(`Successfully processed incident ID: ${incidentId} (ID: ${result.data.upsertOneClassification._id})`);
    return result;
  }
  catch (error: any) {
    spinner.fail(`Error upserting classification: ${error.message}`);
    throw error;
  }
}

async function prepareClassificationsData(
  csvFile: string,
  namespace: string,
  mappingFile: string,
  graphqlEndpoint: string,
  sessionToken: string
): Promise<ClassificationInsertType[]> {
  logSection('Data Preparation');
  const data = readCSVFile(csvFile);

  const mapping = readMappingFile(mappingFile);
  const fieldMapping = mapping.fieldMappings;
  const valueMapping = mapping.valueMappings;

  const taxonomyFields = await fetchTaxonomyDefinition(graphqlEndpoint, namespace, sessionToken);

  logSection('Data Transformation');
  const classifications = transformToClassificationsFormat(data, namespace, fieldMapping, taxonomyFields, valueMapping);

  return classifications;
}

function performDryRun(classifications: ClassificationInsertType[]): void {
  logSection('Dry Run Mode');
  console.log(chalk.yellow('No changes will be made to the database.'));

  if (classifications.length === 0) {
    console.log('No classifications to process.');
    return;
  }

  console.log(`Found ${chalk.cyan(classifications.length.toString())} classifications to process.`);

  // Output all classifications with their GraphQL variables
  classifications.forEach((classification, index) => {
    const incidentId = classification.incidents?.link[0] as number;

    console.log(chalk.cyan(`\n--- Classification ${index + 1}/${classifications.length} (Incident ID: ${incidentId}) ---`));

    // Show the attributes that will be inserted
    console.log('Attributes to be inserted:');
    if (classification.attributes && classification.attributes.length > 0) {
      classification.attributes.forEach(attr => {
        if (attr) {
          console.log(`  ${attr.short_name}: ${attr.value_json}`);
        }
      });
    }
    else {
      console.log('  No attributes found for this classification.');
    }

    // Output the GraphQL variables in a condensed format
    console.log('\nGraphQL operation:');
    console.log(`  Namespace: ${classification.namespace}`);
    console.log(`  Incident ID: ${incidentId}`);
    console.log(`  Number of attributes: ${classification.attributes?.length || 0}`);
  });

  // Add a simple summary at the end of the dry run
  logSection('Dry Run Summary');
  console.log(`Total classifications: ${classifications.length}`);
  console.log(`Would succeed: ${chalk.green(classifications.length.toString())}`);
  console.log(`Would fail: ${chalk.red('0')}`);
  console.log(`Would skip: ${chalk.yellow('0')}`);

  logSuccess('Dry run completed. Use the same command without --dryRun to apply these changes.');
}

async function importClassifications(
  classifications: ClassificationInsertType[],
  graphqlEndpoint: string,
  sessionToken: string
): Promise<void> {
  logSection('Import Process');

  if (classifications.length === 0) {
    console.log('No classifications to process.');
    return;
  }

  console.log(`Processing ${chalk.cyan(classifications.length.toString())} classifications via GraphQL...`);
  let processed = 0;
  let errors = 0;

  for (const classification of classifications) {
    try {
      const response = await executeGraphQLMutation(graphqlEndpoint, classification, sessionToken);

      if (response.errors && response.errors.length > 0) {
        response.errors.forEach(error => {
          console.log(chalk.red(`  - ${error.message}`));
        });
        errors++;
      }
      else if (!response.data || !response.data.upsertOneClassification) {
        errors++;
      }
      else {
        processed++;
      }
    }
    catch (error: any) {
      const incidentId = classification.incidents?.link[0];
      logError(`Error processing classification for incident ${incidentId}: ${error.message}`);
      errors++;
    }
  }

  logSection('Import Summary');
  console.log(`Total classifications: ${classifications.length}`);
  console.log(`Successfully processed: ${chalk.green(processed.toString())}`);
  console.log(`Errors: ${chalk.red(errors.toString())}`);

  if (processed === classifications.length) {
    logSuccess('All classifications were successfully imported!');
  }
  else {
    logWarning(`Import completed with ${errors} errors.`);
  }
}

async function main(): Promise<void> {
  try {
    console.log(chalk.green('Classifications Import Tool'));
    const args = parseArgs();
    console.log(chalk.yellow('Source CSV:'), args.csvFile);
    console.log(chalk.yellow('Namespace:'), args.namespace);

    // Log mapping file information
    console.log(chalk.yellow('Mapping file:'), args.mappingFile);

    console.log(chalk.yellow('GraphQL endpoint:'), args.graphqlEndpoint);

    if (args.dryRun) {
      console.log(chalk.yellow('DRY RUN MODE: No changes will be made to the database'));
    }

    const startTime = Date.now();

    const classifications = await prepareClassificationsData(
      args.csvFile,
      args.namespace,
      args.mappingFile,
      args.graphqlEndpoint,
      args.sessionToken
    );

    if (args.dryRun) {
      performDryRun(classifications);
    }
    else {
      await importClassifications(classifications, args.graphqlEndpoint, args.sessionToken);
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    logSection('Process Complete');
    console.log(`Duration: ${Math.round(duration)} seconds`);
  }
  catch (error) {
    logSection('Fatal Error');
    logError(`${error}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export {
  readCSVFile,
  readMappingFile,
  transformToClassificationsFormat,
  executeGraphQLOperation,
  executeGraphQLMutation,
  parseArgs,
  prepareClassificationsData,
  performDryRun,
  importClassifications as importClassificationsToDatabase,
  fetchTaxonomyDefinition,
  convertValueByMongoType,
  validateValueAgainstPermittedValues,
  main
}; 