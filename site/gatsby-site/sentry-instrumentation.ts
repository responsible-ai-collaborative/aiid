import * as  Sentry from '@sentry/aws-serverless'
import type { Handler, HandlerContext, HandlerEvent, HandlerResponse } from "@netlify/functions";
import { netlifyEventToLambdaEvent } from './src/utils/serverless';

const environment = process.env.SENTRY_ENVIRONMENT || 'development';

if (process.env.SENTRY_DSN) {

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
        tracesSampleRate: 0.1, // one out of ten transactions
        environment,
        debug: environment === 'development',
    });
}

export const wrapHandler = (handler: Handler): Handler => {

    if (!process.env.SENTRY_DSN) {

        return handler;
    }

    return async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {

        const sentryWrappedHandler = Sentry.wrapHandler(handler);
        const extendedEvent = netlifyEventToLambdaEvent(event);

        // @ts-ignore
        return sentryWrappedHandler(extendedEvent, context)!;
    };
};
