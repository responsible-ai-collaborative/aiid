import { schema } from '../../server/schema';
import { context } from '../../server/context';
import { ApolloServer } from '@apollo/server';
import config from '../../server/config';
import { MongoClient } from 'mongodb';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import cookie from 'cookie';
import { wrapHandler } from '../../sentry-instrumentation';
import { Handler } from '@netlify/functions';

const server = new ApolloServer({
    schema,
});

const client = new MongoClient(config.API_MONGODB_CONNECTION_STRING);

const handler = startServerAndCreateLambdaHandler(
    server,
    handlers.createAPIGatewayProxyEventV2RequestHandler(), { context: ({ event }) => context({ req: event as any, client }) }
);

// @ts-ignore
module.exports = { handler: wrapHandler(handler) };