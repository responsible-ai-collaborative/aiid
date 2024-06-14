import { startStandaloneServer } from '@apollo/server/standalone';
import { schema } from './schema';
import { context } from './context';
import { ApolloServer } from '@apollo/server';
import config from './config';
import { MongoClient } from 'mongodb';

(async () => {

    const server = new ApolloServer({
        schema,
    });

    const client = new MongoClient(config.MONGODB_CONNECTION_STRING);

    const { url } = await startStandaloneServer(server, { context: ({ req }) => context({ req, client }) });

    console.log(`🚀  Server ready at: ${url}`);
})();
