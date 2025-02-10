import * as  Sentry from '@sentry/aws-serverless'
import type { Context, HandlerEvent } from "@netlify/functions";
import cookie from 'cookie';

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

export const wrapHandler = (handler: HandlerEvent): HandlerEvent => {

    if (!process.env.SENTRY_DSN) {
        return handler;
    }

    const sentryWrappedHandler = Sentry.wrapHandler(handler);

    return async (event: HandlerEvent, context: Context) => {

        if (!event.requestContext) {
            event.requestContext = { http: { method: event.httpMethod } };
        }

        if (!event.rawQuery) {
            event.rawQueryString = event.rawQuery;
        }

        if (!event.method) {
            event.method = event.httpMethod;
        }

        if (!event.cookies) {
            event.cookies = cookie.parse(event.headers.cookie || '');
        }

        return sentryWrappedHandler(event, context);
    };
};
