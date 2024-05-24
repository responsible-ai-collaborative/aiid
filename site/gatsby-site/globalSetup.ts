import { MongoMemoryServer } from 'mongodb-memory-server';

export = async function globalSetup() {
  
  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();

  (global as any).__MONGOINSTANCE = instance;

  console.log('MONGOINSTANCE', uri);

  process.env.MONGODB_CONNECTION_STRING = uri.slice(0, uri.lastIndexOf('/'));
};
