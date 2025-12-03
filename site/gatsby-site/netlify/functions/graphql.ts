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

// Simple rate limiter: 60 requests per minute per IP
const MAX_REQUESTS_PER_MINUTE = 60;

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(ip);
        }
    }
}, 5 * 60 * 1000);

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const entry = rateLimitStore.get(ip);

    if (!entry || entry.resetTime < now) {
        // First request or expired window (1 minute)
        rateLimitStore.set(ip, {
            count: 1,
            resetTime: now + 60 * 1000,
        });
        return { allowed: true };
    }

    entry.count++;

    if (entry.count > MAX_REQUESTS_PER_MINUTE) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
        return { allowed: false, retryAfter };
    }

    return { allowed: true };
}

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

            // Rate limiting
            const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim() 
                || event.headers['x-real-ip'] 
                || 'unknown';
            
            const rateLimitCheck = checkRateLimit(ip);

            if (!rateLimitCheck.allowed) {
                console.warn('[Rate Limit] Request blocked:', { ip });
                
                span.setAttribute('rate_limit.blocked', true);

                return {
                    statusCode: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': rateLimitCheck.retryAfter?.toString() || '60',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({
                        errors: [{
                            message: `Rate limit exceeded. Maximum ${MAX_REQUESTS_PER_MINUTE} requests per minute allowed.`,
                            extensions: { 
                                code: 'RATE_LIMIT_EXCEEDED',
                                retryAfter: rateLimitCheck.retryAfter,
                            }
                        }]
                    }),
                };
            }

            // @ts-ignore
            const result = await graphqlHandler(event, netlifyContext);

            return result;
        }
    );
};

// @ts-ignore
module.exports = { handler: withSentry(handler) };