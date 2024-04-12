import { startStandaloneServer } from '@apollo/server/standalone';
import { getSchema } from './server';
import { context } from './context';
import { ApolloServer } from '@apollo/server';

(async () => {

    const schema = await getSchema();

    const server = new ApolloServer({
        schema,
    });

    const { url } = await startStandaloneServer(server, { context });

    console.log(`🚀  Server ready at: ${url}`);
})();
