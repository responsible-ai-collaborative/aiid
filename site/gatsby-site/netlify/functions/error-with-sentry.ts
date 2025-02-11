import { withSentry } from "../../sentry-instrumentation";
import { HandlerEvent, Handler, HandlerContext } from '@netlify/functions'

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {


    throw new Error('test error');

    return {
        statusCode: 200,
        body: JSON.stringify({
            test: 'test'
        })
    }

}

module.exports = { handler: withSentry(handler) };