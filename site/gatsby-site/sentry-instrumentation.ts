import * as  Sentry from '@sentry/aws-serverless'

if (process.env.SENTRY_DSN) {

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
        tracesSampleRate: 0.1, // one out of ten transactions
    });
}

export const wrapHandler = process.env.SENTRY_DSN ? Sentry.wrapHandler : (handler: any) => handler;