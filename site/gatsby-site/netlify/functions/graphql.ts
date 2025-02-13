import { withSentry } from '../../sentry-instrumentation';
import { schema } from '../../server/schema';
import { context } from '../../server/context';
import { ApolloServer, ApolloServerPlugin } from '@apollo/server';
import config from '../../server/config';
import { MongoClient } from 'mongodb';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { netlifyEventToLambdaEvent } from '../../src/utils/serverless';
import * as Sentry from '@sentry/aws-serverless';
import { HandlerContext, HandlerEvent } from '@netlify/functions';
import { Context } from '../../server/interfaces';

const sentryPlugin: ApolloServerPlugin<Context> = {
    async requestDidStart(requestContext) {

        const activeSpan = Sentry.getActiveSpan();

        if (activeSpan) {

            activeSpan.setAttribute('graphql.user.id', requestContext.contextValue?.user?.id);
            activeSpan.setAttribute('graphql.operation', requestContext.request.operationName || 'anonymous');
            activeSpan.setAttribute('graphql.query', requestContext.request.query);
            activeSpan.setAttribute('graphql.variables', JSON.stringify(requestContext.request.variables));
        }

        return {
            async willSendResponse(requestContext: any) {
                const activeSpan = Sentry.getActiveSpan();

                if (activeSpan && requestContext.response.http) {
                    activeSpan.setAttribute('http.status_code', requestContext.response.http.status);
                }
            },
            async didEncounterErrors(requestContext: any) {
                requestContext.errors?.forEach((error: any) => {
                    Sentry.captureException(error);
                });
            }
        };
    }
};

const server = new ApolloServer({
    schema,
    plugins: [sentryPlugin]
});

const client = new MongoClient(config.API_MONGODB_CONNECTION_STRING);

const graphqlHandler = startServerAndCreateLambdaHandler(
    server,
    handlers.createAPIGatewayProxyEventV2RequestHandler(), {
    context: ({ event }) => context({ req: event as any, client }),
    middleware: [
        async (event) => {
            netlifyEventToLambdaEvent(event as any);
            return;
        }
    ]
});

const handler = async (event: HandlerEvent, netlifyContext: HandlerContext) => {
    return Sentry.startSpan(
        {
            op: 'lambda.graphql',
            name: 'GraphQL Lambda Handler',
        },
        async (span) => {

            span.setAttribute('http.method', event.httpMethod);
            span.setAttribute('url', event.rawUrl);

            // @ts-ignore
            const result = await graphqlHandler(event, netlifyContext);

            return result;
        }
    );
};

// @ts-ignore
module.exports = { handler: withSentry(handler) };