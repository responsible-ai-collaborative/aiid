import { schema } from '../../server/schema';
import { context } from '../../server/context';
import { ApolloServer } from '@apollo/server';
import config from '../../server/config';
import { MongoClient } from 'mongodb';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { wrapHandler } from '../../sentry-instrumentation';
import { netlifyEventToLambdaEvent } from '../../src/utils/serverless';

const server = new ApolloServer({
    schema,
});

const client = new MongoClient(config.API_MONGODB_CONNECTION_STRING);

const handler = startServerAndCreateLambdaHandler(
    server,
    handlers.createAPIGatewayProxyEventV2RequestHandler(), {
    context: ({ event }) => {

        const extendedEvent = netlifyEventToLambdaEvent(event as any);

        return context({ req: extendedEvent as any, client })
    }
});

// @ts-ignore
module.exports = { handler: wrapHandler(handler) };