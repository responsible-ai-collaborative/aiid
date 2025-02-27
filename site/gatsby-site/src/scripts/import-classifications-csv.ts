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
import ora from 'ora';
import chalk from 'chalk';
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import fetch from 'cross-fetch';
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

interface Mapping {
  fieldMappings: Record<string, string>;
  valueMappings: Record<string, Record<string, string>>;
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


const logger = {
  section: (title: string): void => {
    console.log('\n' + chalk.blue('='.repeat(80)));
    console.log(chalk.blue(title));
    console.log(chalk.blue('='.repeat(80)));
  },

  warning: (message: string): void => {
    console.warn(chalk.yellow(`\nWarning: ${message}`));
  },

  error: (message: string): void => {
    console.error(chalk.red(`\nError: ${message}`));
  },

  success: (message: string): void => {
    console.log(chalk.green(`\n${message}`));
  },

  info: (message: string): void => {
    console.log(message);
  }
};

/**
 * Creates an Apollo client for GraphQL operations
 */
function createApolloClient(endpoint: string, sessionToken: string): ApolloClient<any> {
  return new ApolloClient({
    link: new HttpLink({
      uri: endpoint,
      fetch,
      headers: {
        'Cookie': `__Secure-next-auth.session-token=${encodeURIComponent(sessionToken)};next-auth.session-token=${encodeURIComponent(sessionToken)}`
      }
    }),
    cache: new InMemoryCache({ addTypename: false }),
  });
}

/**
 * Parse command line arguments
 */
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
      description: 'Next.js Auth session token for authentication',
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

/**
 * Read and parse CSV file
 */
function readCSVFile(filePath: string): CSVRow[] {
  try {
    logger.info(`Reading CSV file: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    logger.info(`Read ${records.length} rows from CSV file`);
    return records;
  }
  catch (error) {
    logger.error(`Error reading CSV file: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Read and parse mapping file
 */
function readMappingFile(filePath: string): Mapping {
  try {
    logger.info(`Reading mapping file: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const mapping = JSON.parse(fileContent) as Mapping;

    // Validate the structure
    if (!mapping.fieldMappings) {
      throw new Error(`Missing "fieldMappings" section in the mapping file: ${filePath}`);
    }

    if (!mapping.valueMappings) {
      throw new Error(`Missing "valueMappings" section in the mapping file: ${filePath}`);
    }

    // Warn if sections are empty
    if (Object.keys(mapping.fieldMappings).length === 0) {
      logger.warning(`"fieldMappings" section is empty in the mapping file: ${filePath}`);
    }

    if (Object.keys(mapping.valueMappings).length === 0) {
      logger.warning(`"valueMappings" section is empty in the mapping file: ${filePath}`);
    }

    logger.info(`Loaded ${Object.keys(mapping.fieldMappings).length} field mappings and ${Object.keys(mapping.valueMappings).length} value mapping categories`);
    return mapping;
  }
  catch (error) {
    logger.error(`Error reading mapping file: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Fetch taxonomy definition from GraphQL API
 */
async function fetchTaxonomyDefinition(
  endpoint: string,
  namespace: string,
  sessionToken: string
): Promise<TaxonomyField[]> {
  const spinner = ora(`Fetching taxonomy definition for namespace: ${namespace}`).start();
  const client = createApolloClient(endpoint, sessionToken);

  const query = gql`
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
    const result = await client.query({
      query,
      variables,
      fetchPolicy: 'no-cache'
    });

    // Check for GraphQL errors
    if (result.errors && result.errors.length > 0) {
      const errorMessages = result.errors.map(e => e.message).join(', ');
      spinner.fail(`GraphQL errors when fetching taxonomy: ${errorMessages}`);
      throw new Error(`GraphQL errors: ${errorMessages}`);
    }

    if (!result.data?.taxa?.field_list || result.data.taxa.field_list.length === 0) {
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

/**
 * Convert value based on MongoDB type
 */
function convertValueByMongoType(value: string, mongoType: string): any {
  switch (mongoType) {
    case 'string':
      return value.trim();
    default:
      throw new Error(`Unsupported mongo_type: ${mongoType}. Supported types: string`);
  }
}

/**
 * Validate a value against permitted values, applying mapping if available
 */
function validateValueAgainstPermittedValues(
  value: any,
  permittedValues?: string[],
  valueMapping?: Record<string, Record<string, string>>,
  fieldName?: string
): { isValid: boolean; mappedValue: any } {
  // If there are no permitted values, any value is valid
  if (!permittedValues || permittedValues.length === 0) {
    return { isValid: true, mappedValue: value };
  }

  // Convert value to string for comparison with permitted values
  const stringValue = String(value);

  // Check if we have a mapping for this value
  if (valueMapping && fieldName && valueMapping[fieldName] && valueMapping[fieldName][stringValue]) {
    const mappedValue = valueMapping[fieldName][stringValue];
    // Check if the mapped value is valid
    if (permittedValues.includes(mappedValue)) {
      return { isValid: true, mappedValue };
    }
  }

  // If no mapping or mapping didn't match, check if the original value is valid
  const isValid = permittedValues.includes(stringValue);
  return { isValid, mappedValue: value };
}

/**
 * Transform CSV data to classifications format
 */
function transformToClassificationsFormat(
  data: CSVRow[],
  namespace: string,
  fieldMapping: Record<string, string>,
  taxonomyFields: TaxonomyField[],
  valueMapping?: Record<string, Record<string, string>>
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
      logger.warning(`Skipping row with invalid Incident ID: ${row['Incident ID']}`);
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
          logger.warning(`Field "${destinationField}" not found in taxonomy definition for incident ID ${incidentId}.`);
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
          logger.warning(`${(error as Error).message} Field: "${destinationField}" for incident ID ${incidentId}.`);
          invalidFields.push(`${destinationField} (type conversion error: ${taxonomyField.mongo_type})`);
          continue;
        }

        // Validate against permitted values if available
        const validationResult = validateValueAgainstPermittedValues(convertedValue, taxonomyField.permitted_values, valueMapping, destinationField);
        if (!validationResult.isValid) {
          logger.warning(`Value "${rawValue}" for field "${destinationField}" is not in the permitted values for incident ID ${incidentId}.`);

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
      logger.error(`Skipping entire classification for incident ID ${incidentId} due to ${invalidFields.length} invalid field(s)`);
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
    logger.section('Validation Issues Summary');
    console.log(chalk.yellow(`${Object.keys(validationIssues).length} incidents had validation issues and were skipped:`));

    Object.entries(validationIssues).forEach(([incidentId, issues]) => {
      console.log(chalk.yellow(`  Incident ID ${incidentId}: ${issues.length} invalid field(s)`));
      issues.forEach(issue => {
        console.log(chalk.yellow(`    - ${issue}`));
      });
    });
  }

  logger.section('Processing Summary');
  console.log(`Total rows in CSV: ${data.length}`);
  console.log(`Successfully processed: ${chalk.green(processedCount.toString())}`);
  console.log(`Skipped due to validation issues: ${chalk.yellow(skippedCount.toString())}`);

  return classifications;
}

/**
 * Import classifications to database via GraphQL
 */
async function importClassifications(
  classifications: ClassificationInsertType[],
  graphqlEndpoint: string,
  sessionToken: string
): Promise<void> {
  logger.section('Import Process');

  if (classifications.length === 0) {
    logger.info('No classifications to process.');
    return;
  }

  logger.info(`Processing ${chalk.cyan(classifications.length.toString())} classifications via GraphQL...`);
  let processed = 0;
  let errors = 0;

  // Create a single Apollo client instance to be reused for all mutations
  const client = createApolloClient(graphqlEndpoint, sessionToken);

  const mutation = gql`
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

  for (const classification of classifications) {
    const incidentId = classification.incidents?.link[0] as number;
    const spinner = ora(`Processing incident ID: ${incidentId}`).start();

    const filter: ClassificationFilterType = {
      incidents: {
        EQ: incidentId
      } as IntFilter,
      namespace: {
        EQ: classification.namespace
      }
    };

    try {
      const result = await client.mutate({
        mutation,
        variables: {
          filter,
          update: classification
        },
        fetchPolicy: 'no-cache'
      });

      // Check for GraphQL errors in the response
      if (result.errors && result.errors.length > 0) {
        spinner.fail(`GraphQL errors for incident ${incidentId}`);
        result.errors.forEach(error => {
          console.log(chalk.red(`  - ${error.message}`));
        });
        errors++;
        continue;
      }

      // Check for missing or unexpected data
      if (!result.data?.upsertOneClassification) {
        spinner.fail(`Unexpected GraphQL response for incident ${incidentId}: Missing data`);
        console.log(chalk.yellow(`  Response data: ${JSON.stringify(result.data)}`));
        errors++;
        continue;
      }

      // Success case
      spinner.succeed(`Successfully processed incident ID: ${incidentId} (ID: ${result.data.upsertOneClassification._id})`);
      processed++;
    }
    catch (error: any) {
      spinner.fail(`Error processing classification for incident ${incidentId}`);
      logger.error(`Error details: ${error.message}`);

      // Check for network errors
      if (error.networkError) {
        console.log(chalk.red(`  Network error: ${error.networkError.message}`));
      }

      // Check for GraphQL errors
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        error.graphQLErrors.forEach((graphQLError: any) => {
          console.log(chalk.red(`  GraphQL error: ${graphQLError.message}`));
        });
      }

      errors++;
    }
  }

  logger.section('Import Summary');
  console.log(`Total classifications: ${classifications.length}`);
  console.log(`Successfully processed: ${chalk.green(processed.toString())}`);
  console.log(`Errors: ${chalk.red(errors.toString())}`);

  if (processed === classifications.length) {
    logger.success('All classifications were successfully imported!');
  }
  else {
    logger.warning(`Import completed with ${errors} errors.`);
  }
}

/**
 * Prepare classifications data from CSV and mapping files
 */
async function prepareClassificationsData(
  csvFile: string,
  namespace: string,
  mappingFile: string,
  graphqlEndpoint: string,
  sessionToken: string
): Promise<{ classifications: ClassificationInsertType[]; totalRows: number; skippedCount: number }> {
  logger.section('Data Preparation');
  const data = readCSVFile(csvFile);
  const totalRows = data.length;

  const mapping = readMappingFile(mappingFile);
  const taxonomyFields = await fetchTaxonomyDefinition(graphqlEndpoint, namespace, sessionToken);

  logger.section('Data Transformation');
  const result = transformToClassificationsFormat(
    data, 
    namespace, 
    mapping.fieldMappings, 
    taxonomyFields, 
    mapping.valueMappings
  );
  
  // Calculate skipped count
  const skippedCount = totalRows - result.length;
  
  return { 
    classifications: result,
    totalRows,
    skippedCount
  };
}

/**
 * Perform a dry run without making changes to the database
 */
function performDryRun(classifications: ClassificationInsertType[], totalRowsInCsv: number, skippedCount: number): void {
  logger.section('Dry Run Mode');
  console.log(chalk.yellow('No changes will be made to the database.'));

  if (classifications.length === 0) {
    logger.info('No classifications to process.');
    return;
  }

  logger.info(`Found ${chalk.cyan(classifications.length.toString())} valid classifications to process.`);

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
  logger.section('Dry Run Summary');
  console.log(`Total rows in CSV: ${totalRowsInCsv}`);
  console.log(`Would process: ${chalk.green(classifications.length.toString())}`);
  console.log(`Would skip: ${chalk.yellow(skippedCount.toString())}`);

  logger.success('Dry run completed. Use the same command without --dryRun to apply these changes.');
}

/**
 * Main function
 */
async function main(): Promise<void> {
  try {
    console.log(chalk.green('Classifications Import Tool'));
    const args = parseArgs();
    console.log(chalk.yellow('Source CSV:'), args.csvFile);
    console.log(chalk.yellow('Namespace:'), args.namespace);
    console.log(chalk.yellow('Mapping file:'), args.mappingFile);
    console.log(chalk.yellow('GraphQL endpoint:'), args.graphqlEndpoint);

    if (args.dryRun) {
      console.log(chalk.yellow('DRY RUN MODE: No changes will be made to the database'));
    }

    const startTime = Date.now();

    const { classifications, totalRows, skippedCount } = await prepareClassificationsData(
      args.csvFile,
      args.namespace,
      args.mappingFile,
      args.graphqlEndpoint,
      args.sessionToken
    );

    if (args.dryRun) {
      performDryRun(classifications, totalRows, skippedCount);
    }
    else {
      await importClassifications(classifications, args.graphqlEndpoint, args.sessionToken);
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    logger.section('Process Complete');
    console.log(`Duration: ${Math.round(duration)} seconds`);
    console.log(`Total rows in CSV: ${totalRows}`);
    console.log(`Successfully processed: ${chalk.green(classifications.length.toString())}`);
    console.log(`Skipped: ${chalk.yellow(skippedCount.toString())}`);
  }
  catch (error) {
    logger.section('Fatal Error');
    logger.error(`${error}`);
    process.exit(1);
  }
}

// Run the script if it's called directly
if (require.main === module) {
  main();
}

// Export functions for testing or reuse
export {
  readCSVFile,
  readMappingFile,
  transformToClassificationsFormat,
  createApolloClient,
  parseArgs,
  prepareClassificationsData,
  performDryRun,
  importClassifications as importClassificationsToDatabase,
  fetchTaxonomyDefinition,
  convertValueByMongoType,
  validateValueAgainstPermittedValues,
  main
}; 