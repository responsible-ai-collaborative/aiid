/**
 * A script for restoring data from a MongoDB database to an in-memory MongoDB instance.
 * 
 * Usage: npm run restore-mongodb -- --sourceUrl=SOURCE_MONGODB_URL --destinationUrl=DESTINATION_MONGODB_URL --databases=aiidprod,translations
 * 
 * The script will copy all collections from the specified databases from the source to the destination MongoDB instance.
 * By default, it will restore the 'aiidprod' and 'translations' databases, but you can specify other databases as needed.
 * 
 * Example:
 * npm run restore-mongodb -- --sourceUrl=mongodb+srv://*:*@*.mongodb.net --destinationUrl=mongodb://127.0.0.1:4110/
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

async function copyCollection(
  sourceClient: MongoClient,
  destinationClient: MongoClient,
  dbName: string,
  collectionName: string,
  dryRun: boolean
): Promise<{ count: number; size: number }> {
  const sourceDb = sourceClient.db(dbName);
  const sourceCollection = sourceDb.collection(collectionName);
  
  // Get document count and size estimate
  const count = await sourceCollection.countDocuments();
  const stats = await sourceDb.command({ collStats: collectionName });
  const sizeInMB = Math.round((stats.size / (1024 * 1024)) * 100) / 100;
  
  if (dryRun) {
    return { count, size: sizeInMB };
  }
  
  const destinationDb = destinationClient.db(dbName);
  
  // Drop the collection if it exists
  try {
    await destinationDb.collection(collectionName).drop();
  } catch (error) {
    // Collection might not exist, which is fine
  }
  
  const destinationCollection = destinationDb.collection(collectionName);
  
  // Copy documents in batches to avoid memory issues
  const batchSize = 1000;
  let copied = 0;
  const spinner = ora(`Copying ${collectionName} (${count} documents, ${sizeInMB} MB)`).start();
  
  if (count > 0) {
    const cursor = sourceCollection.find({});
    let batch = [];
    
    for await (const doc of cursor) {
      batch.push(doc);
      
      if (batch.length >= batchSize) {
        await destinationCollection.insertMany(batch);
        copied += batch.length;
        batch = [];
        spinner.text = `Copying ${collectionName}: ${copied}/${count} documents`;
      }
    }
    
    if (batch.length > 0) {
      await destinationCollection.insertMany(batch);
      copied += batch.length;
    }
  }
  
  spinner.succeed(`Copied ${collectionName}: ${copied}/${count} documents (${sizeInMB} MB)`);
  return { count, size: sizeInMB };
}

async function restoreDatabase(
  sourceClient: MongoClient,
  destinationClient: MongoClient,
  dbName: string,
  dryRun: boolean
): Promise<{ collections: number; documents: number; size: number }> {
  console.log(chalk.blue(`\nProcessing database: ${dbName}`));
  
  const collections = await listCollections(sourceClient, dbName);
  console.log(`Found ${collections.length} collections in ${dbName}`);
  
  let totalDocuments = 0;
  let totalSize = 0;
  
  for (const collectionName of collections) {
    const { count, size } = await copyCollection(
      sourceClient,
      destinationClient,
      dbName,
      collectionName,
      dryRun
    );
    totalDocuments += count;
    totalSize += size;
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
    
    console.log(chalk.green('MongoDB Restore Tool'));
    console.log(chalk.yellow('Source URL:'), args.sourceUrl);
    console.log(chalk.yellow('Destination URL:'), args.destinationUrl);
    console.log(chalk.yellow('Databases to restore:'), databases.join(', '));
    
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
        args.dryRun
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
  main
}; 