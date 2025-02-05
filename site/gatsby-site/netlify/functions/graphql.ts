import { schema } from '../../server/schema';
import { context } from '../../server/context';
import { ApolloServer } from '@apollo/server';
import config from '../../server/config';
import { MongoClient } from 'mongodb';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import cookie from 'cookie';
import { wrapHandler } from '../../sentry-instrumentation';

const server = new ApolloServer({
    schema,
});

const client = new MongoClient(config.API_MONGODB_CONNECTION_STRING);

const handler = startServerAndCreateLambdaHandler(
    server,
    handlers.createAPIGatewayProxyEventV2RequestHandler(),
    {
        context: ({ event }) => context({ req: event as any, client }),
        middleware: [
            async (event) => {

                // when running the functions locally these properties are missing

                if (!event.requestContext) {
                    event.requestContext = { http: { method: event.httpMethod } };
                }

                if (!event.rawQuery) {
                    event.rawQueryString = event.rawQuery;
                }

                // next auth expects the `req` object to be Express-like

                event.method = event.httpMethod;
                event.cookies = cookie.parse(event.headers.cookie || '');

                return (result) => result;
            },
        ],
    }
);

module.exports = { handler: wrapHandler(handler) };