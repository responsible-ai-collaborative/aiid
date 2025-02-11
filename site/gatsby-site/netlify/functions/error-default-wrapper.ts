import * as  Sentry from '@sentry/aws-serverless'
import { HandlerEvent, Handler } from '@netlify/functions'

const environment = process.env.SENTRY_ENVIRONMENT || 'development';

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
    tracesSampleRate: 1, // one out of ten transactions
    environment,
    debug: environment === 'development' || environment === 'staging',
    // integrations: [
    //     Sentry.nodeContextIntegration(),
    //     Sentry.awsLambdaIntegration(),
    //     Sentry.graphqlIntegration()
    // ],
    // defaultIntegrations: false,
});

const handler: Handler = async (event: HandlerEvent) => {


    throw new Error('test error');

    return {
        statusCode: 200,
        body: JSON.stringify({
            test: 'test'
        })
    }

}

module.exports = { handler: Sentry.wrapHandler(handler) };