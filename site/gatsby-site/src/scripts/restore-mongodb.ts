/**
 * A script for restoring data from a MongoDB database to an in-memory MongoDB instance.
 * 
 * Usage: npm run restore-mongodb -- --sourceUrl=SOURCE_MONGODB_URL --destinationUrl=DESTINATION_MONGODB_URL --databases=aiidprod,translations [--incidentIds=ID1,ID2,ID3] [--reportNumbers=NUM1,NUM2,NUM3] [--classificationNamespaces=CSETv1,CSETv0]
 * 
 * The script will copy all collections from the specified databases from the source to the destination MongoDB instance.
 * By default, it will restore the 'aiidprod' and 'translations' databases, but you can specify other databases as needed.
 * You can optionally specify which incidents to restore by using the --incidentIds parameter with a comma-separated list.
 * You can optionally specify which reports to restore by using the --reportNumbers parameter with a comma-separated list.
 * You can optionally specify which classification namespaces to restore by using the --classificationNamespaces parameter with a comma-separated list.
 * When specifying incidents, the script will automatically include only the reports associated with those incidents.
 * When specifying incidents, the script will also include all related incidents (similar and dissimilar) and their reports.
 * If incidentIds is not provided, all incidents will be restored.
 * If reportNumbers is not provided, all reports will be restored.
 * If classificationNamespaces is not provided, all classifications will be restored.
 * 
 * Example:
 * npm run restore-mongodb -- --sourceUrl=mongodb+srv://*:*@*.mongodb.net --destinationUrl=mongodb://127.0.0.1:4110/
 * npm run restore-mongodb -- --sourceUrl=mongodb+srv://*:*@*.mongodb.net --destinationUrl=mongodb://127.0.0.1:4110/ --incidentIds=1,42,100
 * npm run restore-mongodb -- --sourceUrl=mongodb+srv://*:*@*.mongodb.net --destinationUrl=mongodb://127.0.0.1:4110/ --classificationNamespaces=CSETv1,CSETv0
 */

import { MongoClient } from 'mongodb';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import ora from 'ora';
import chalk from 'chalk';

interface CommandLineArgs {
  sourceUrl: string;
  destinationUrl: string;
  databases: string;
  dryRun: boolean;
  incidentIds: string;
  reportNumbers: string;
  classificationNamespaces: string;
}

function parseArgs(): CommandLineArgs {
  return yargs(hideBin(process.argv))
    .option('sourceUrl', {
      description: 'Source MongoDB connection URL',
      type: 'string',
      demandOption: true
    })
    .option('destinationUrl', {
      description: 'Destination MongoDB connection URL (defaults to local in-memory MongoDB)',
      type: 'string',
      default: 'mongodb://127.0.0.1:4110/'
    })
    .option('databases', {
      description: 'Comma-separated list of databases to restore',
      type: 'string',
      default: 'aiidprod,translations'
    })
    .option('dryRun', {
      description: 'Run without making changes to the destination database',
      type: 'boolean',
      default: false
    })
    .option('incidentIds', {
      description: 'Comma-separated list of incident IDs to restore. Associated reports will be included. If not provided, all incidents will be restored.',
      type: 'string',
      default: ''
    })
    .option('reportNumbers', {
      description: 'Comma-separated list of report numbers to restore. If not provided, all reports will be restored.',
      type: 'string',
      default: ''
    })
    .option('classificationNamespaces', {
      description: 'Comma-separated list of classification namespaces to restore (e.g. CSETv1,CSETv0). If not provided, all classifications will be restored.',
      type: 'string',
      default: ''
    })
    .help()
    .alias('help', 'h')
    .parseSync() as CommandLineArgs;
}

async function connectToMongoDB(url: string, description: string): Promise<MongoClient> {
  const spinner = ora(`Connecting to ${description} MongoDB at ${url}`).start();
  try {
    const client = new MongoClient(url);
    await client.connect();
    spinner.succeed(`Connected to ${description} MongoDB`);
    return client;
  } catch (error) {
    spinner.fail(`Failed to connect to ${description} MongoDB: ${(error as Error).message}`);
    throw error;
  }
}

async function listDatabases(client: MongoClient): Promise<string[]> {
  const adminDb = client.db('admin');
  const { databases } = await adminDb.admin().listDatabases();
  return databases
    .map((db: { name: string }) => db.name)
    .filter((name: string) => !['admin', 'local', 'config'].includes(name));
}

async function listCollections(client: MongoClient, dbName: string): Promise<string[]> {
  const db = client.db(dbName);
  const collections = await db.listCollections().toArray();
  return collections.map(collection => collection.name);
}

async function findAllRelatedIncidents(
  sourceClient: MongoClient,
  initialIncidentIds: number[]
): Promise<Set<number>> {
  const sourceDb = sourceClient.db('aiidprod');
  const incidentsCollection = sourceDb.collection('incidents');

  // Use a Set to avoid duplicates - always includes the initial IDs
  const processedIncidentIds = new Set<number>(initialIncidentIds);
  // Start with the initial incident IDs
  const pendingIncidentIds = [...initialIncidentIds];

  const spinner = ora(`Finding related incidents...`).start();

  // Process incidents recursively to find all related incidents
  while (pendingIncidentIds.length > 0) {
    const currentId = pendingIncidentIds.shift();

    if (currentId === undefined) {
      continue;
    }

    // Find the incident document to extract related incidents
    const incident = await incidentsCollection.findOne({ incident_id: currentId });

    if (incident) {
      // Extract and add all related incident IDs from the similarity fields
      let relatedIds: number[] = [];

      // Add similar incidents from NLP - these are objects with incident_id property
      if (incident.nlp_similar_incidents && Array.isArray(incident.nlp_similar_incidents)) {
        const nlpIds = incident.nlp_similar_incidents.map(item => Number(item.incident_id));
        relatedIds = [...relatedIds, ...nlpIds];
      }

      // Add similar incidents from editor - these are direct number IDs
      if (incident.editor_similar_incidents && Array.isArray(incident.editor_similar_incidents)) {
        relatedIds = [...relatedIds, ...incident.editor_similar_incidents];
      }

      // Add dissimilar incidents from editor - these are direct number IDs
      if (incident.editor_dissimilar_incidents && Array.isArray(incident.editor_dissimilar_incidents)) {
        relatedIds = [...relatedIds, ...incident.editor_dissimilar_incidents];
      }

      // Add flagged dissimilar incidents - these are direct number IDs
      if (incident.flagged_dissimilar_incidents && Array.isArray(incident.flagged_dissimilar_incidents)) {
        relatedIds = [...relatedIds, ...incident.flagged_dissimilar_incidents];
      }

      // Add new IDs to the pending list for processing
      for (const id of relatedIds) {
        if (!processedIncidentIds.has(id)) {
          processedIncidentIds.add(id);
          pendingIncidentIds.push(id);
        }
      }
    }
  }

  spinner.succeed(`Found ${processedIncidentIds.size} incidents including initial and related incidents`);
  return processedIncidentIds;
}

// Add helper functions for computing associated report numbers and ordering collections
async function computeAssociatedReportNumbers(
  sourceClient: MongoClient,
  incidentIds: number[],
  reportNumbers: number[]
): Promise<number[]> {
  const sourceDb = sourceClient.db('aiidprod');
  const incidentsCollection = sourceDb.collection('incidents');
  const incidents = await incidentsCollection.find({ incident_id: { $in: incidentIds } }).toArray();
  let assocReports: number[] = [];
  for (const incident of incidents) {
    if(incident.reports && Array.isArray(incident.reports)) {
      assocReports.push(...incident.reports);
    }
  }
  if(reportNumbers.length > 0) {
    assocReports.push(...reportNumbers);
  }
  return [...new Set(assocReports)];
}

function orderCollections(
  collections: string[],
  reportNumbers: number[],
  classificationNamespaces: string[]
): string[] {
  const ordered = [...collections];
  const incidentsIndex = ordered.indexOf('incidents');
  if(incidentsIndex > 0) {
    ordered.splice(incidentsIndex, 1);
    ordered.unshift('incidents');
  }
  if(reportNumbers.length > 0) {
    const reportsIndex = ordered.indexOf('reports');
    if(reportsIndex > 1) {
      ordered.splice(reportsIndex, 1);
      ordered.splice(1, 0, 'reports');
    }
  }
  if(classificationNamespaces.length > 0) {
    const classificationsIndex = ordered.indexOf('classifications');
    if(classificationsIndex > -1) {
      const pos = reportNumbers.length > 0 ? 2 : 1;
      if(classificationsIndex > pos) {
        ordered.splice(classificationsIndex, 1);
        ordered.splice(pos, 0, 'classifications');
      }
    }
  }
  return ordered;
}

// Updated copyCollection function signature and internals
async function copyCollection(
  sourceClient: MongoClient,
  destinationClient: MongoClient,
  dbName: string,
  collectionName: string,
  dryRun: boolean,
  incidentIds: number[] = [],
  classificationNamespaces: string[] = [],
  computedReportNumbers: number[] = []
): Promise<{ count: number; size: number }> {
  const sourceDb = sourceClient.db(dbName);
  const sourceCollection = sourceDb.collection(collectionName);

  const isIncidentsCollection = collectionName === 'incidents';
  const isReportsCollection = collectionName === 'reports';
  const isClassificationsCollection = collectionName === 'classifications';
  const hasClassificationFilter = isClassificationsCollection && classificationNamespaces.length > 0;

  let query = {};
  if(isIncidentsCollection && incidentIds.length > 0) {
    query = { incident_id: { $in: incidentIds } };
  } else if(isReportsCollection && computedReportNumbers.length > 0) {
    query = { report_number: { $in: computedReportNumbers } };
  } else if(isClassificationsCollection && hasClassificationFilter) {
    query = { namespace: { $in: classificationNamespaces } };
  }

  let count;
  if((isIncidentsCollection && incidentIds.length > 0) ||
     (isReportsCollection && computedReportNumbers.length > 0) ||
     (isClassificationsCollection && hasClassificationFilter)) {
    count = await sourceCollection.countDocuments(query);
  } else {
    count = await sourceCollection.countDocuments();
  }

  const stats = await sourceDb.command({ collStats: collectionName });
  const sizeInMB = Math.round((stats.size / (1024 * 1024)) * 100) / 100;

  if(dryRun) {
    return { count, size: sizeInMB };
  }

  const destinationDb = destinationClient.db(dbName);
  try {
    await destinationDb.collection(collectionName).drop();
  } catch (error) {
    // Collection might not exist, which is fine
  }

  const destinationCollection = destinationDb.collection(collectionName);
  const batchSize = 1000;
  let copied = 0;
  const spinner = ora(`Copying ${collectionName} (${count} documents, ${sizeInMB} MB)`).start();

  if(count > 0) {
    let cursor;
    if(Object.keys(query).length > 0) {
      cursor = sourceCollection.find(query);
    } else {
      cursor = sourceCollection.find({});
    }

    let batch = [];
    for await (const doc of cursor) {
      batch.push(doc);
      if(batch.length >= batchSize) {
        await destinationCollection.insertMany(batch);
        copied += batch.length;
        batch = [];
        spinner.text = `Copying ${collectionName}: ${copied}/${count} documents`;
      }
    }

    if(batch.length > 0) {
      await destinationCollection.insertMany(batch);
      copied += batch.length;
    }
  }

  spinner.succeed(`Copied ${collectionName}: ${copied}/${count} documents (${sizeInMB} MB)`);
  return { count, size: sizeInMB };
}

// Updated restoreDatabase to use helper functions for ordering and computing associated reports
async function restoreDatabase(
  sourceClient: MongoClient,
  destinationClient: MongoClient,
  dbName: string,
  dryRun: boolean,
  incidentIds: number[] = [],
  reportNumbers: number[] = [],
  classificationNamespaces: string[] = []
): Promise<{ collections: number; documents: number; size: number }> {
  console.log(chalk.blue(`\nProcessing database: ${dbName}`));

  let collections = await listCollections(sourceClient, dbName);
  console.log(`Found ${collections.length} collections in ${dbName}`);

  let totalDocuments = 0;
  let totalSize = 0;

  if(dbName === 'aiidprod' && (incidentIds.length > 0 || reportNumbers.length > 0 || classificationNamespaces.length > 0)) {
    if(incidentIds.length > 0) {
      const allRelatedIncidents = await findAllRelatedIncidents(sourceClient, incidentIds);
      incidentIds = Array.from(allRelatedIncidents);
      console.log(chalk.green(`Including ${incidentIds.length} incidents after adding related incidents`));
    }
    collections = orderCollections(collections, reportNumbers, classificationNamespaces);
    let computedReportNumbers: number[] = [];
    if(incidentIds.length > 0 || reportNumbers.length > 0) {
      computedReportNumbers = await computeAssociatedReportNumbers(sourceClient, incidentIds, reportNumbers);
      console.log(chalk.yellow(`Found ${computedReportNumbers.length} reports associated with provided parameters`));
    }
    for (const collectionName of collections) {
      const { count, size } = await copyCollection(
        sourceClient,
        destinationClient,
        dbName,
        collectionName,
        dryRun,
        incidentIds,
        classificationNamespaces,
        computedReportNumbers
      );
      totalDocuments += count;
      totalSize += size;
    }
  } else {
    for (const collectionName of collections) {
      const { count, size } = await copyCollection(
        sourceClient,
        destinationClient,
        dbName,
        collectionName,
        dryRun,
        incidentIds,
        classificationNamespaces
      );
      totalDocuments += count;
      totalSize += size;
    }
  }

  return {
    collections: collections.length,
    documents: totalDocuments,
    size: totalSize
  };
}

async function main(): Promise<void> {
  try {
    const args = parseArgs();
    const databases = args.databases.split(',').map(db => db.trim());

    // Parse incident IDs if provided
    const incidentIds: number[] = args.incidentIds
      ? args.incidentIds.split(',')
        .map(id => Number(id.trim()))
        .filter(id => !isNaN(id))
      : [];

    // Parse report numbers if provided
    const reportNumbers: number[] = args.reportNumbers
      ? args.reportNumbers.split(',')
        .map(num => Number(num.trim()))
        .filter(num => !isNaN(num))
      : [];

    // Parse classification namespaces if provided
    const classificationNamespaces: string[] = args.classificationNamespaces
      ? args.classificationNamespaces.split(',').map(ns => ns.trim()).filter(ns => ns)
      : [];

    console.log(chalk.green('MongoDB Restore Tool'));
    console.log(chalk.yellow('Source URL:'), args.sourceUrl);
    console.log(chalk.yellow('Destination URL:'), args.destinationUrl);
    console.log(chalk.yellow('Databases to restore:'), databases.join(', '));

    if (incidentIds.length > 0) {
      console.log(chalk.yellow('Initial Incident IDs:'), incidentIds.join(', '), '(will include related incidents and reports)');
    } else {
      console.log(chalk.yellow('Incident IDs:'), 'All incidents will be restored');
    }

    if (reportNumbers.length > 0) {
      console.log(chalk.yellow('Report Numbers:'), reportNumbers.join(', '));
    } else {
      console.log(chalk.yellow('Report Numbers:'), 'All reports will be restored');
    }

    if (classificationNamespaces.length > 0) {
      console.log(chalk.yellow('Classification Namespaces:'), classificationNamespaces.join(', '));
    } else {
      console.log(chalk.yellow('Classification Namespaces:'), 'All classifications will be restored');
    }

    if (args.dryRun) {
      console.log(chalk.yellow('DRY RUN MODE: No changes will be made to the destination database'));
    }

    const sourceClient = await connectToMongoDB(args.sourceUrl, 'source');
    const destinationClient = await connectToMongoDB(args.destinationUrl, 'destination');

    const availableDatabases = await listDatabases(sourceClient);

    const invalidDatabases = databases.filter(db => !availableDatabases.includes(db));
    if (invalidDatabases.length > 0) {
      console.warn(chalk.yellow(`Warning: The following databases were not found in the source: ${invalidDatabases.join(', ')}`));
    }

    const validDatabases = databases.filter(db => availableDatabases.includes(db));
    if (validDatabases.length === 0) {
      console.error(chalk.red('Error: None of the specified databases were found in the source'));
      process.exit(1);
    }

    console.log(chalk.green(`\nRestoring ${validDatabases.length} databases: ${validDatabases.join(', ')}`));

    const startTime = Date.now();
    let totalCollections = 0;
    let totalDocuments = 0;
    let totalSize = 0;

    for (const dbName of validDatabases) {
      const { collections, documents, size } = await restoreDatabase(
        sourceClient,
        destinationClient,
        dbName,
        args.dryRun,
        incidentIds,
        reportNumbers,
        classificationNamespaces
      );
      totalCollections += collections;
      totalDocuments += documents;
      totalSize += size;
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log(chalk.green('\nRestore Summary:'));
    console.log(`Databases: ${validDatabases.length}`);
    console.log(`Collections: ${totalCollections}`);
    console.log(`Documents: ${totalDocuments}`);
    console.log(`Total Size: ${Math.round(totalSize * 100) / 100} MB`);
    console.log(`Duration: ${Math.round(duration)} seconds`);

    if (args.dryRun) {
      console.log(chalk.yellow('\nThis was a dry run. No changes were made to the destination database.'));
      console.log(chalk.yellow('Run the command without --dryRun to perform the actual restore.'));
    }

    await sourceClient.close();
    await destinationClient.close();

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export {
  parseArgs,
  connectToMongoDB,
  listDatabases,
  listCollections,
  copyCollection,
  restoreDatabase,
  findAllRelatedIncidents,
  main
}; 