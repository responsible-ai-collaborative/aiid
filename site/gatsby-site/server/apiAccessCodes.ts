/**
 * Error codes and user-facing copy for the API access gate.
 *
 * This module is imported by both the server gate (`server/apiAccess.ts`) and
 * browser components (via `src/utils/apiAccess.js`), so the message a user reads
 * has one definition. It must therefore stay free of imports: anything pulled in
 * here — `mongodb`, `graphql-middleware` — would end up in the browser bundle.
 */

/** Returned when the caller has no session. */
export const API_LOGIN_REQUIRED = 'API_LOGIN_REQUIRED';

/** Returned when the caller's account has been blocked from the API. */
export const API_ACCESS_BLOCKED = 'API_ACCESS_BLOCKED';

export const API_LOGIN_REQUIRED_MESSAGE =
    'To mitigate a very high load of bot traffic, this functionality requires that you log in to the database.';

export const API_ACCESS_BLOCKED_MESSAGE =
    'API access for this account has been blocked. If you believe this is a mistake, please contact the AI Incident Database team.';

export type ApiAccessDenialCode = typeof API_LOGIN_REQUIRED | typeof API_ACCESS_BLOCKED;
