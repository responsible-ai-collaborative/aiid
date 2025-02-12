import * as Sentry from '@sentry/aws-serverless';
import type { Handler, HandlerContext, HandlerEvent, HandlerResponse } from "@netlify/functions";

const environment = process.env.SENTRY_ENVIRONMENT || 'development';
const release = process.env.SENTRY_RELEASE;

if (process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment,
        release,
        tracesSampleRate: 1, // adjust the sample rate as needed
        debug: environment === 'development' || environment === 'staging',
    });
}

/**
 * A Sentry wrapper that instruments a Netlify function using the new tracing APIs.
 *
 * This example uses Sentry.startSpan() with forceTransaction:true so that the span
 * appears as a transaction in Sentry’s UI. The span automatically becomes active
 * for the callback and is ended automatically when the callback completes.
 */
export const withSentry = (handler: Handler): Handler => {

    return async (event: HandlerEvent, netlifyContext: HandlerContext): Promise<HandlerResponse> => {

        const url = new URL(event.rawUrl);
        const transactionName = `${event.httpMethod} ${url.pathname}`;

        return await Sentry.startSpan(
            {
                name: transactionName,
                op: "http.server",
                forceTransaction: true,
                attributes: {
                    "http.method": event.httpMethod,
                    "url.path": url.pathname,
                    "url.scheme": url.protocol.replace(":", ""),
                },
            },
            async (span) => {

                Sentry.withScope((scope) => {
                    scope.setTransactionName(transactionName);
                    scope.setContext("netlify", { ...netlifyContext });
                    scope.setTag("environment", environment);
                    scope.setTag("server_name", url.hostname);
                });

                try {

                    const response = await handler(event, netlifyContext)!;

                    span.setAttribute("http.status_code", response?.statusCode);

                    if (response?.statusCode && response?.statusCode >= 200 && response?.statusCode < 300) {

                        span.setStatus({ code: 1, message: "ok" });
                    } else {

                        span.setStatus({ code: 2, message: "error" });
                    }

                    return response;

                } catch (error: any) {

                    span.setStatus({ code: 2, message: error.message });
                    Sentry.captureException(error);

                    return {
                        statusCode: 500,
                        body: JSON.stringify({ error: error.message }),
                    };

                } finally {

                    await Sentry.flush(2000);
                }
            }
        );
    };
};