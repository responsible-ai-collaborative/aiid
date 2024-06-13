import { MongoMemoryServer } from 'mongodb-memory-server';

export = async function globalSetup() {

  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();

  (global as any).__MONGOINSTANCE = instance;

  process.env.MONGODB_API_CONNECTION_STRING = uri.slice(0, uri.lastIndexOf('/'));
};
