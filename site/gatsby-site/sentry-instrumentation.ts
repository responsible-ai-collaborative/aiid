import * as  Sentry from '@sentry/aws-serverless'
import type { Context, Handler, HandlerContext, HandlerEvent, HandlerResponse } from "@netlify/functions";
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

interface ExtendedHandlerEvent extends HandlerEvent {
    [key: string]: unknown;
}

export const wrapHandler = (handler: Handler): Handler => {

    if (!process.env.SENTRY_DSN) {
        return handler;
    }

    const sentryWrappedHandler = Sentry.wrapHandler(handler);

    return async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {

        const extendedEvent = event as ExtendedHandlerEvent;

        if (!extendedEvent.requestContext) {
            extendedEvent.requestContext = { http: { method: event.httpMethod } };
        }

        if (!extendedEvent.rawQuery) {
            extendedEvent.rawQueryString = event.rawQuery;
        }

        if (!extendedEvent.method) {
            extendedEvent.method = event.httpMethod;
        }

        if (!extendedEvent.cookies) {
            extendedEvent.cookies = cookie.parse(event.headers.cookie || '');
        }

        // @ts-ignore
        return sentryWrappedHandler(extendedEvent, context)!;
    };
};
