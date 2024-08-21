import { startStandaloneServer } from '@apollo/server/standalone';
import { schema } from './schema';
import { context } from './context';
import { ApolloServer } from '@apollo/server';
import config from './config';
import { MongoClient } from 'mongodb';

(async () => {

    try {
        const server = new ApolloServer({
            schema,
        });

        const client = new MongoClient(config.API_MONGODB_CONNECTION_STRING);

        const { url } = await startStandaloneServer(server, { context: ({ req }) => context({ req, client }) });

        console.log(`🚀  Server ready at: ${url}`);
    }
    catch (e) {

        console.error(e);
    }
})();
