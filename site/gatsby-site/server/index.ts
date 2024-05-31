import { startStandaloneServer } from '@apollo/server/standalone';
import { schema } from './schema';
import { context } from './context';
import { ApolloServer } from '@apollo/server';

(async () => {

    const server = new ApolloServer({
        schema,
    });

    const { url } = await startStandaloneServer(server, { context });

    console.log(`🚀  Server ready at: ${url}`);
})();
