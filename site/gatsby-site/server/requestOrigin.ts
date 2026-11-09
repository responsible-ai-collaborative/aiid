import type { HandlerEvent } from '@netlify/functions';

const ALLOWED_ORIGINS = new Set([
    'https://incidentdatabase.ai',
    'https://staging-aiid.netlify.app',
]);

// Origin takes precedence; Referer is a fallback for clients that omit it.
export const validateOrigin = (event: Pick<HandlerEvent, 'headers'>) => {
    const value = event.headers.origin || event.headers.referer || '';

    let isAllowedOrigin = false;

    try {
        isAllowedOrigin = ALLOWED_ORIGINS.has(new URL(value).origin);
    } catch {
        // Missing and malformed URLs fail closed.
    }

    if (!isAllowedOrigin) {
        return {
            statusCode: 403,
            body: JSON.stringify({
                error: 'Forbidden - Invalid origin',
                message: 'API access is restricted to authorized domains'
            }),
        };
    }

    return null;
};
