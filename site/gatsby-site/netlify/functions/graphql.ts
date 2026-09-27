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
import { apiUsagePlugin } from '../../server/apiUsage';
import { isApiAccessDenialCode } from '../../server/apiAccess';

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
                    // API access denials are the expected response to a logged-out
                    // or blocked caller, not a fault. Reporting them would bury
                    // real errors under the very bot traffic the gate exists to
                    // turn away. The volume is still observable: it is counted per
                    // account in `customData.api_usage` (SEE: server/apiUsage.ts)
                    // and, for callers with no account, in Netlify's own logs.
                    if (isApiAccessDenialCode(error?.extensions?.code)) {
                        return;
                    }

                    Sentry.captureException(error);
                });
            }
        };
    }
};

const client = new MongoClient(config.API_MONGODB_CONNECTION_STRING, {
    maxPoolSize: 10,  // default 100
    minPoolSize: 1,  // default 0
    maxIdleTimeMS: 60000,
});

const server = new ApolloServer({
    schema,
    // `apiUsagePlugin` counts each request against the account that made it, so
    // usage can be reported per account and abusive volume identified.
    // SEE: server/apiUsage.ts
    plugins: [sentryPlugin, apiUsagePlugin(client)]
});

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

const ALLOWED_ORIGINS = [
    'https://incidentdatabase.ai',
    'https://staging-aiid.netlify.app',
];

const BLOCKED_AGENTS = [
    'python-requests',
    'python-urllib',
    'curl/',
    'wget/',
    'postman',
    'insomnia',
    'httpie',
    'go-http-client',
    'java/',
    'okhttp',
];

// Validates Origin/Referer headers to ensure requests come from allowed domains only
const validateOrigin = (event: HandlerEvent) => {
    const origin = event.headers.origin || event.headers.referer || '';

    const isAllowedOrigin = origin !== '' && ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed));

    if (!isAllowedOrigin) {
        return {
            statusCode: 403,
            body: JSON.stringify({
                error: 'Forbidden - Invalid origin',
                message: 'API access is restricted to authorized domains'
            }),
        };
    }

    return null;
};

// Validates User-Agent header to block automated tools and non-browser clients
const validateUserAgent = (event: HandlerEvent) => {
    const userAgent = (event.headers['user-agent'] || '').toLowerCase();

    const isSuspiciousAgent = BLOCKED_AGENTS.some(agent => userAgent.includes(agent));

    if (isSuspiciousAgent) {
        return {
            statusCode: 403,
            body: JSON.stringify({
                error: 'Forbidden - Invalid client',
                message: 'API access is restricted to web browsers'
            }),
        };
    }

    return null;
};

const handler = async (event: HandlerEvent, netlifyContext: HandlerContext) => {
    return Sentry.startSpan(
        {
            op: 'lambda.graphql',
            name: 'GraphQL Lambda Handler',
        },
        async (span) => {

            span.setAttribute('http.method', event.httpMethod);
            span.setAttribute('url', event.rawUrl);

            // Only validate POST requests (mutations/queries), allow GET for Apollo Playground
            if (event.httpMethod === 'POST') {
              if (process.env.API_VALIDATE_ORIGIN === 'true') {
                const originError = validateOrigin(event);
                if (originError) return originError;
              }

              if (process.env.API_VALIDATE_USER_AGENT === 'true') {
                const userAgentError = validateUserAgent(event);
                if (userAgentError) return userAgentError;
              }
            }

            // @ts-ignore
            const result = await graphqlHandler(event, netlifyContext);

            return result;
        }
    );
};

// @ts-ignore
module.exports = { handler: withSentry(handler) };
