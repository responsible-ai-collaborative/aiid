import * as  Sentry from '@sentry/aws-serverless'
import type { Handler, HandlerContext, HandlerEvent, HandlerResponse } from "@netlify/functions";
import { netlifyEventToLambdaEvent } from './src/utils/serverless';

const environment = process.env.SENTRY_ENVIRONMENT || 'development';

if (process.env.SENTRY_DSN) {

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
        tracesSampleRate: 1, // one out of ten transactions
        environment,
        debug: environment === 'development' || environment === 'staging',
        integrations: [
            Sentry.nodeContextIntegration(),
            Sentry.awsLambdaIntegration(),
            Sentry.graphqlIntegration()
        ]
    });
}

export const wrapHandler = (handler: Handler): Handler => {

    if (!process.env.SENTRY_DSN) {

        return handler;
    }

    return async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {

        const sentryWrappedHandler = Sentry.wrapHandler(handler);
        const extendedEvent = netlifyEventToLambdaEvent(event);

        try {

            // @ts-ignore
            return sentryWrappedHandler(extendedEvent, context)!;
        }
        catch (error) {

            Sentry.captureException(error);

            throw error;
        }
    };
};

const FLUSH_TIMEOUT_MS = 2000;

const extractFileBaseNameFromPathRegex = /([^/]+)\.[^.]+$/;

function getTraceStatusString(status: number): string {
    if (status >= 200 && status < 300) {
        return "ok";
    }

    switch (status) {
        case 400:
            return "invalid_argument";
        case 401:
            return "unauthenticated";
        case 403:
            return "permission_denied";
        case 404:
            return "not_found";
        case 409:
            return "already_exists";
        case 429:
            return "resource_exhausted";
        case 499:
            return "cancelled";
        case 500:
            return "unknown_error";
        case 501:
            return "unimplemented";
        case 503:
            return "unavailable";
        case 504:
            return "deadline_exceeded";
    }

    return "unknown";
}

export const withSentry = (handler: Handler): Handler => {

    return (event: HandlerEvent, netlifyContext: HandlerContext) => {
        Sentry.getClient()?.addEventProcessor((event) => {
            event.environment = environment;
            return event;
        });

        const urlObject = new URL(event.rawUrl);
        let fileName: string | undefined;
        try {
            fileName = __filename;
        } catch {
            try {
                fileName = import.meta.filename;
            } catch {
                fileName = undefined;
            }
        }
        const functionName =
            fileName && extractFileBaseNameFromPathRegex.exec(fileName)?.[1];
        const functionSpanName =
            functionName ??
            extractFileBaseNameFromPathRegex.exec(urlObject.pathname)?.[1] ??
            urlObject.pathname ??
            "";

        const processResult = async () => {
            let rv: ReturnType<typeof handler>;
            try {
                rv = handler(event, netlifyContext);
            } catch (e) {
                Sentry.captureException(e);
                throw e;
            }

            return rv;
        };

        const functionSpan = () => {
            return Sentry.startSpanManual(
                {
                    name: functionSpanName,
                    op: "function.netlify",
                    attributes: {
                        "faas.name": functionName,
                        // let Sentry set cloud.resource_id if it can find it
                        "faas.invocation_id": netlifyContext.awsRequestId,
                        "faas.trigger": "http",
                        "sentry.source": "component",
                        "sentry.origin": "auto.function.netlify",
                        "code.filepath": fileName,
                    },
                },
                (span) =>
                    processResult()
                        .then((r) => {
                            span.setStatus({ code: 1, message: "ok" });
                            return r;
                        })
                        .catch((e: Error) => {
                            span.setStatus({ code: 2, message: e.message });
                            throw e;
                        })
                        .finally(() => {
                            span.end();
                        })
            );
        };

        const httpSpan = () =>
            Sentry.startSpanManual(
                {
                    name: `${event.httpMethod} ${urlObject.pathname}`,
                    op: "http.server",
                    attributes: {
                        "http.request.method": event.httpMethod,
                        "http.method": event.httpMethod,
                        "url.path": urlObject.pathname,
                        "url.scheme": urlObject.protocol.replace(/:$/, ""),
                        "url.query": urlObject.search.replace(/^\?/, ""),
                        "client.address": netlifyContext.clientContext?.clientIp,
                        "user_agent.original": event.headers["user-agent"] || undefined,
                        "sentry.source": "url",
                        "sentry.origin": "auto.function.netlify",
                        "http.query": urlObject.search,
                    },
                },
                async (span) => {
                    return functionSpan()
                        .then((response) => {
                            if (response) {
                                const statusString = getTraceStatusString(response.statusCode);
                                span.setAttributes({
                                    "http.response.status_code": response.statusCode,
                                });
                                span.setStatus({
                                    code: statusString === "ok" ? 1 : 2,
                                    message: statusString,
                                });
                                for (const entry of Object.entries(event?.headers ?? [])) {
                                    span.setAttributes({
                                        ["http.request.header." + entry[0]]: entry[1],
                                    });
                                }
                                for (const entry of Object.entries(response?.headers ?? [])) {
                                    span.setAttributes({
                                        ["http.response.header." + entry[0]]: entry[1],
                                    });
                                }
                            } else {
                                span.setStatus({ code: 2, message: "undefined" });
                            }
                            return response;
                        })
                        .catch((e) => {
                            span.setStatus({ code: 2, message: e.message });
                            throw e;
                        })
                        .finally(() => {
                            span.end();
                        });
                }
            );

        const httpSpanWithTrace = () =>
            Sentry.continueTrace(
                {
                    sentryTrace: event.headers["sentry-trace"] || undefined,
                    baggage: event.headers["baggage"],
                },
                httpSpan
            );

        return Sentry.withIsolationScope((scope) => {
            scope.setTransactionName(functionName);
            scope.setContext("netlify", { ...netlifyContext });
            scope.setContext("cloud_resource", {
                "cloud.provider": "netlify",
                // "cloud.account.id": netlifyContext.account.id,
                // "cloud.region": netlifyContext.server.region,
                "cloud.platform": "netlify_functions",
            });
            scope.setTags({
                environment,
                // release: netlifyContext.deploy.id,
                server_name: urlObject.hostname,
            });

            return httpSpanWithTrace();
        }).finally(() => Sentry.flush(FLUSH_TIMEOUT_MS));
    };
};