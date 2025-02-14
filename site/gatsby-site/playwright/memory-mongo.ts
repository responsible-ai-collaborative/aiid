import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import assert from 'node:assert';
import incidents from './seeds/aiidprod/incidents';
import reports from './seeds/aiidprod/reports';
import submissions from './seeds/aiidprod/submissions';
import entities from './seeds/aiidprod/entities';
// TODO: Delete "reports_es" when all translations are moved to "reports"
import reports_es from './seeds/translations/reports_es';
import reportsTranslations from './seeds/translations/reports';
import classifications from './seeds/aiidprod/classifications';
import taxa from './seeds/aiidprod/taxa';
import candidates from './seeds/aiidprod/candidates';
import duplicates from './seeds/aiidprod/duplicates';

import users from './seeds/customData/users';
import entity_relationships from './seeds/aiidprod/entity_relationships';
import subscriptions from './seeds/customData/subscriptions';

import authUsers from './seeds/auth/users';

import reportsHistory from './seeds/history/reportsHistory';
import incidentsHistory from './seeds/history/incidentsHistory';
import checklists from './seeds/aiidprod/checklists';

/**
 * Initializes a MongoDB database with predefined and optional custom seed data.
 * 
 * @param {Record<string, Record<string, Record<string, unknown>[]>>} [seed] - Optional additional seed data
 *        organized as database -> collection -> documents structure.
 *        Example: { database1: { collection1: [ doc1, doc2 ] } }
 * @param {Object} [options={ drop: false }] - Configuration options
 * @param {boolean} [options.drop=false] - Whether to drop existing collections before seeding
 * @returns {Promise<void>} A promise that resolves when seeding is complete
 * 
 * @example
 * // Initialize with default data only
 * await init();
 * 
 * // Initialize with default data and deletes whats in myCollection
 * await init({
 *   myDatabase: {
 *     myCollection: [{ field: 'value' }]
 *   }
 * }, { drop: true });
 */
export const init = async (seed?: Record<string, Record<string, Record<string, unknown>[]>>, { drop } = { drop: false }) => {

    await seedFixture({
        aiidprod: {
            incidents,
            reports,
            submissions,
            entities,
            classifications,
            taxa,
            entity_relationships,
            candidates,
            duplicates,
            checklists,
        },
        customData: {
            users,
            subscriptions,
        },
        translations: {
            // TODO: Delete "reports_es" when all translations are moved to "reports"
            reports_es,
            reports: reportsTranslations,
        },
        auth: {
            users: authUsers,
        },
        history: {
            reports: reportsHistory,
            incidents: incidentsHistory,
        }
    });

    if (seed) {

        await seedFixture(seed, drop);
    }

    console.log('Memory Mongo initialized');
}

export const seedCollection = async ({ name, docs, database = 'aiidprod', drop = true }: { name: string, database?: string, docs: Record<string, unknown>[], drop?: boolean }) => {

    // we require the connection string because the instance variable is not always available
    assert(process.env.MONGODB_CONNECTION_STRING?.includes('localhost') || process.env.MONGODB_CONNECTION_STRING?.includes('127.0.0.1'), 'Seeding is only allowed on localhost');

    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING!);

    const db = client.db(database);
    const collection = db.collection(name);

    if (drop && (await db.listCollections().toArray()).find(c => c.name === name)) {

        await collection.drop();
    }

    if (docs.length) {

        const result = await collection.insertMany(docs);

        return result;
    }
}

export const seedFixture = async (seeds: Record<string, Record<string, Record<string, unknown>[]>>, drop = true) => {

    for (const [database, collection] of Object.entries(seeds)) {

        for (const [name, docs] of Object.entries(collection)) {

            await seedCollection({ database, name, docs, drop });
        }
    }
}

export const execute = async (fn: (client: MongoClient) => Promise<void>) => {

    assert(process.env.MONGODB_CONNECTION_STRING?.includes('localhost') || process.env.MONGODB_CONNECTION_STRING?.includes('127.0.0.1'), `Seeding is only allowed on localhost [${process.env.MONGODB_CONNECTION_STRING}]`);

    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING!);

    await client.connect();

    try {

        await fn(client);
    }
    finally {

        await client.close();
    }
}


// command line support

let instance: MongoMemoryServer |  null = null;

async function start() {

    instance = await MongoMemoryServer.create({ instance: { port: 4110 } });

    await init();

    console.log(`\nIn memory mongodb started on  ${instance.getUri()} \n\n`,);
};

async function stop() {

    if (instance) {

        await instance.stop();
    }
}

process.on('SIGINT', async () => {

    console.log("\nTerminating...");

    await stop();

    process.exit(0);
});


if (require.main === module) {
    start();
}

