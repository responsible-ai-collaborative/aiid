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

export const withSentry = (handler: Handler): Handler => {
    return async (event: HandlerEvent, netlifyContext: HandlerContext): Promise<HandlerResponse> => {

        Sentry.withScope((scope) => {
            scope.setContext("request", {
                method: event.httpMethod,
                url: event.rawUrl,
                headers: event.headers,
            });
            scope.setTag("environment", environment);
        });

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
                try {

                    const response = await handler(event, netlifyContext)!;

                    span.setAttribute("http.status_code", response?.statusCode);

                    span.setStatus(
                        response?.statusCode && response.statusCode >= 200 && response.statusCode < 300
                            ? { code: 1, message: "ok" }
                            : { code: 2, message: "error" }
                    );

                    return response;

                } catch (error) {

                    span.setStatus({ code: 2, message: (error as Error).message });
                    Sentry.captureException(error);

                    return {
                        statusCode: 500,
                        body: JSON.stringify({ error: (error as Error).message }),
                    };

                } finally {
                    await Sentry.flush(2000);
                }
            }
        );
    };
};