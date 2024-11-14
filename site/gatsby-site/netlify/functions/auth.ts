import NextAuth from "next-auth";
import { getAuthConfig } from "../../nextauth.config";
import { createResponse } from '../../src/utils/serverless'

const parseBody = (event) => {

    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    const { body } = event;

    if (!body) return undefined;

    if (contentType?.includes('application/json')) {
        try {
            return JSON.parse(body);
        } catch (e) {
            console.error('Failed to parse JSON body:', e);
            return undefined;
        }
    }

    if (contentType?.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams(body);
        const formData: Record<string, string> = {};
        params.forEach((value, key) => {
            formData[key] = value;
        });
        return formData;
    }

    return undefined;
};

const parseCookies = (cookieHeader: string) => {
    const cookies: Record<string, string> = {};
    if (!cookieHeader) return cookies;

    cookieHeader.split(';').forEach(cookie => {
        const parts = cookie.trim().split('=');
        if (parts.length >= 2) {
            const key = parts[0];
            const value = parts.slice(1).join('=');
            cookies[key] = decodeURIComponent(value);
        }
    });

    return cookies;
};

const parseHeaders = (event: any) => {

    return {
        ...event.headers,
        host: event.headers.host || new URL(process.env.NEXTAUTH_URL).host,
    }
}

const parseQuery = (event: any) => {

    const path = event.path.replace('/api/auth/', '')
    const nextAuthArray = path.split('/').filter(Boolean);

    return {
        ...event.queryStringParameters,
        nextauth: nextAuthArray,
        action: nextAuthArray[nextAuthArray.length - 1],
        providerId: nextAuthArray[1]
    }
}

const recreateRequest = (event) => {
    return {
        method: event.httpMethod,
        query: parseQuery(event),
        cookies: parseCookies(event.headers.cookie),
        headers: parseHeaders(event),
        body: parseBody(event),
    }
}

export const handler = async (event, context) => {

    const req = recreateRequest(event);
    const res = createResponse();

    try {

        const authConfig = await getAuthConfig();

        await NextAuth(req, res, authConfig)


        const response = res.getResponse();
        const responseHeaders = res.getResponseHeaders();

        return {
            ...response,
            statusCode: response.statusCode || 200,
            body: response.body || '{}',
            headers: {
                ...responseHeaders,
                'Cache-Control': 'no-store, max-age=0'
            }
        }
    } catch (error) {

        console.error('NextAuth Error:', error)
        console.error('Request details:', req);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal Server Error',
                details: error.message,
            })
        }
    }
}