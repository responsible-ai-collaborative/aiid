import { randomBytes } from 'crypto';
import { MongoClient } from 'mongodb';
import { USERS_COLLECTION, USERS_DB } from './apiAccess';

/**
 * Per-account API tokens (SEE: site/docs/API_ACCESS.md, "API tokens").
 *
 * The session cookie is how a browser proves who it is; scripts and agents
 * were having to replay it. Every account now carries a token that stands in
 * for the session on `/api/graphql`, sent as `Authorization: Bearer <token>`.
 * A token authenticates as the account it belongs to — same roles, same block
 * state, same usage accounting — so nothing downstream distinguishes the two,
 * except that requests carrying a token are also counted on the account
 * (`api_token_request_count`) and skip the browser-oriented origin and
 * user-agent heuristics in the Netlify handler.
 */

export const API_TOKEN_PREFIX = 'aiid_';

/** 30 random bytes → 40 base64url characters: 240 bits, unguessable. */
const API_TOKEN_RANDOM_BYTES = 30;

export const API_TOKEN_PATTERN = /^aiid_[A-Za-z0-9_-]{40}$/;

export const generateApiToken = (): string =>
    API_TOKEN_PREFIX + randomBytes(API_TOKEN_RANDOM_BYTES).toString('base64url');

/**
 * `User` fields that only the account itself may read: a token is a credential.
 * Admins can revoke one by regenerating it but never see another account's.
 */
export const API_TOKEN_SECRET_USER_FIELDS = ['api_token'];

/** `User` fields readable by the account itself and by admins. */
export const API_TOKEN_USAGE_USER_FIELDS = ['api_token_request_count', 'api_token_last_used_at'];

export const API_TOKEN_USER_FIELDS = [...API_TOKEN_SECRET_USER_FIELDS, ...API_TOKEN_USAGE_USER_FIELDS];

/**
 * The token presented by a request, or `null`. Read from the standard
 * `Authorization: Bearer` header; header names are lower-cased by both Node
 * and Netlify, but a caller-built object is tolerated too.
 */
export const getApiTokenFromHeaders = (headers: Record<string, string | string[] | undefined> | undefined): string | null => {

    if (!headers) {
        return null;
    }

    const raw = headers.authorization ?? headers.Authorization;

    const value = Array.isArray(raw) ? raw[0] : raw;

    if (typeof value !== 'string') {
        return null;
    }

    const match = value.match(/^\s*Bearer\s+(\S+)\s*$/i);

    return match ? match[1] : null;
}

/** Whether the request carries our kind of token (well-formed, not necessarily valid). */
export const hasApiTokenHeader = (headers: Record<string, string | string[] | undefined> | undefined): boolean => {

    const token = getApiTokenFromHeaders(headers);

    return token !== null && API_TOKEN_PATTERN.test(token);
}

export interface ApiTokenUser {
    id: string;
    roles: string[];
}

/**
 * The account a token belongs to, or `null` for an unknown token. Served by the
 * unique index on `api_token` (SEE: migrations/2026.09.28T12.00.00.add-api-tokens.ts).
 */
export const findUserByApiToken = async (client: MongoClient, token: string): Promise<ApiTokenUser | null> => {

    if (!API_TOKEN_PATTERN.test(token)) {
        return null;
    }

    const user = await client
        .db(USERS_DB)
        .collection(USERS_COLLECTION)
        .findOne<{ userId: string; roles?: string[] }>(
            { api_token: token },
            { projection: { userId: 1, roles: 1 } }
        );

    return user ? { id: user.userId, roles: user.roles ?? [] } : null;
}

/**
 * Replaces the account's token, which invalidates the previous one at once.
 * Retries on the (astronomically unlikely) duplicate, since the index is unique.
 */
export const regenerateUserApiToken = async (client: MongoClient, userId: string): Promise<string> => {

    const users = client.db(USERS_DB).collection(USERS_COLLECTION);

    for (let attempt = 0; attempt < 3; attempt++) {

        const token = generateApiToken();

        try {
            const result = await users.updateOne(
                { userId },
                { $set: { api_token: token, api_token_regenerated_at: new Date() } }
            );

            if (result.matchedCount === 0) {
                throw new Error(`User ${userId} not found`);
            }

            return token;
        }
        catch (e) {
            if ((e as { code?: number }).code === 11000) {
                continue;
            }
            throw e;
        }
    }

    throw new Error('Could not generate a unique API token');
}

/** Counts a request that authenticated with the account's token. */
export const recordApiTokenRequest = async (client: MongoClient, userId: string, now = new Date()) => {

    await client
        .db(USERS_DB)
        .collection(USERS_COLLECTION)
        .updateOne({ userId }, { $inc: { api_token_request_count: 1 }, $set: { api_token_last_used_at: now } });
}
