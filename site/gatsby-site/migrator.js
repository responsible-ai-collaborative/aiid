require('dotenv').config();

const { Umzug } = require('umzug');

const { MongoClient } = require('mongodb');

if (require.main === module && !process.env.MONGODB_MIGRATIONS_CONNECTION_STRING) {
  console.warn('MONGODB_MIGRATIONS_CONNECTION_STRING is not set');
}

const client = new MongoClient(process.env.MONGODB_MIGRATIONS_CONNECTION_STRING);

const collection = client.db('aiidprod').collection('migrations');

const storage = {
  async logMigration({ name: migrationName }) {
    await client.connect();
    await collection.insertOne({ migrationName, createdAt: new Date() });
  },

  async unlogMigration({ name: migrationName }) {
    await client.connect();
    await collection.deleteOne({ migrationName });
  },

  async executed() {
    await client.connect();
    const records = await collection.find({}).sort({ migrationName: 1 }).toArray();

    return records.map((r) => r.migrationName);
  },
};

const umzug = new Umzug({
  storage,
  migrations: {
    glob: './migrations/*.js',
  },
  logger: console,
  context: {
    client,
  },
});

exports.umzug = umzug;

if (require.main === module) {
  umzug.runAsCLI().finally(process.exit);
}
