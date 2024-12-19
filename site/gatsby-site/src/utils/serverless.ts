import config from "../../server/config"
import { HandlerEvent } from '@netlify/functions'

export const createResponse = () => {

    let responseHeaders: Record<string, string> = { 'Content-Type': 'application/json' }
    let response: Record<string, any> = {}

    const res = {
        getHeader: (name: string) => {
            return responseHeaders[name]
        },
        setHeader: (name: string, value: string) => {
            if (name.toLowerCase() === 'set-cookie') {
                response.multiValueHeaders = {
                    ...response.multiValueHeaders,
                    'Set-Cookie': Array.isArray(value) ? value : [value]
                }
            } else {
                responseHeaders[name] = Array.isArray(value) ? value.join(',') : value
                response.headers = responseHeaders
            }
        },
        status: (statusCode: number) => {
            response.statusCode = statusCode
            return res
        },
        send: (body: string | Record<string, any>) => {
            response.body = typeof body === 'string' ? body : JSON.stringify(body)
        },
        json: (json: Record<string, any>) => {
            response.body = JSON.stringify(json)
        },
        end: () => { },
        getResponse: () => response,
        getResponseHeaders: () => responseHeaders,
    }

    return res
}

const parseBody = (event: HandlerEvent) => {

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
        host: event.headers.host || new URL(config.NEXTAUTH_URL).host,
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

export const recreateRequest = (event: HandlerEvent) => {
    return {
        method: event.httpMethod,
        query: parseQuery(event),
        cookies: parseCookies(event.headers.cookie ?? ''),
        headers: parseHeaders(event),
        body: parseBody(event),
    }
}