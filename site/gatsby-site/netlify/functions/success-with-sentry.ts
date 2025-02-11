import { withSentry } from "../../sentry-instrumentation";
import { HandlerEvent, Handler } from '@netlify/functions'

const handler: Handler = async (event: HandlerEvent) => {

    return {
        statusCode: 200,
        body: JSON.stringify({
            test: 'test'
        })
    }

}

module.exports = { handler: withSentry(handler) };