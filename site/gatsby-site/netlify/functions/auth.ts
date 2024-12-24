import NextAuth from "next-auth";
import { getAuthConfig } from "../../nextauth.config";
import { createResponse, recreateRequest } from '../../src/utils/serverless'
import { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {

    const req = recreateRequest(event);
    const res = createResponse();

    try {

        const authConfig = await getAuthConfig(req);

        // @ts-ignore
        await NextAuth(req, res, authConfig)


        const response = res.getResponse();
        const responseHeaders = res.getResponseHeaders();

        return {
            ...response,
            statusCode: response.statusCode,
            body: response.body,
            headers: {
                ...responseHeaders,
                'Cache-Control': 'no-store, max-age=0'
            }
        }
    } catch (error) {

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal Server Error',
                details: (error as Error).message,
            })
        }
    }
}