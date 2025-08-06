/**
 * @fileoverview Utility functions to adapt Next-Auth to work within Netlify Functions environment.
 * Next-Auth expects an Express-like environment with specific request/response semantics,
 * while Netlify Functions use AWS Lambda-style event handling. These utilities
 * bridge that gap by transforming Netlify Function events into Next-Auth compatible formats.
 * 
 * This code is primarily used in netlify/functions/auth to handle authentication requests.
 */

import config from "../../server/config"
import { HandlerEvent } from '@netlify/functions'
import cookie from 'cookie';

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

const parseHeaders = (event: HandlerEvent) => {

    return {
        ...event.headers,
        host: event.headers.host || new URL(config.NEXTAUTH_URL).host,
    }
}

const parseQuery = (event: HandlerEvent) => {

    const path = event.path.replace('/api/auth/', '')
    const nextAuthArray = path.split('/').filter(Boolean);

    const searchParams = new URLSearchParams(event.rawQuery);
    const queryParams = Object.fromEntries(searchParams.entries());

    return {
        ...queryParams,
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

interface ExtendedHandlerEvent extends HandlerEvent {
    [key: string]: unknown;
}

export const netlifyEventToLambdaEvent = (event: HandlerEvent) => {

    const extendedEvent = event as ExtendedHandlerEvent;

    if (!extendedEvent.requestContext) {
        extendedEvent.requestContext = { http: { method: event.httpMethod } };
    }

    if (!extendedEvent.rawQuery) {
        extendedEvent.rawQueryString = event.rawQuery;
    }

    if (!extendedEvent.method) {
        extendedEvent.method = event.httpMethod;
    }

    if (!extendedEvent.cookies) {
        extendedEvent.cookies = cookie.parse(event.headers.cookie || '');
    }

    return extendedEvent;
}