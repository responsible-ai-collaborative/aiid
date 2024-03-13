import { startStandaloneServer } from '@apollo/server/standalone';
import { createServer } from './server';
import { context } from './context';


(async () => {

    const server = await createServer();

    const { url } = await startStandaloneServer(server, { context });

    console.log(`🚀  Server ready at: ${url}`);
})();

