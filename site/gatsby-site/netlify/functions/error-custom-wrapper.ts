import { wrapHandler } from "../../sentry-instrumentation";
import { HandlerEvent, Handler } from '@netlify/functions'

const handler: Handler = async (event: HandlerEvent) => {


    throw new Error('test error');

    return {
        statusCode: 200,
        body: JSON.stringify({
            test: 'test'
        })
    }

}

module.exports = { handler: wrapHandler(handler) };