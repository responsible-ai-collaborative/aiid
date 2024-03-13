import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { mergeSchemas } from '@graphql-tools/schema';
import { getSchema as getLocalSchema } from './local';
import { getSchema as getRemoteSchema } from './remote';
import { context } from './context';

export const createServer = async () => {

    const localSchema = await getLocalSchema();

    const remoteSchema = await getRemoteSchema();

    const gatewaySchema = mergeSchemas({
        schemas: [remoteSchema, localSchema],
    });


    const server = new ApolloServer({
        schema: gatewaySchema,
    });

    return server;
}