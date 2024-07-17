import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';

import incidents from './seeds/aiidprod/incididents';
import reports from './seeds/aiidprod/reports';

import users from './seeds/customData/users';


let instance: MongoMemoryServer | null = null;

async function start() {

    instance = await MongoMemoryServer.create({ instance: { port: 4110 } });
    const uri = instance.getUri();


    const client = new MongoClient(uri);


    await client.db('aiidprod').collection('incidents').insertMany(incidents);
    await client.db('aiidprod').collection('reports').insertMany(reports);

    await client.db('customData').collection('users').insertMany(users);


    console.log(`\n mock API_MONGODB_CONNECTION_STRING ${uri} \n\n`,);
};

async function stop() {

    if (instance) {

        await instance.stop();
    }
}


start();


process.on('SIGINT', async () => {

    console.log("\nTerminating...");

    await stop();

    process.exit(0);
});



