import { IncomingMessage } from "http";
import { MongoClient } from "mongodb";
import { getServerSession } from 'next-auth'
import { getAuthConfig } from "../nextauth.config";
import { createResponse } from '../src/utils/serverless'
import { findUserByApiToken, getApiTokenFromHeaders } from './apiTokens';

export const verifyToken = async (req: IncomingMessage) => {

    const authConfig = await getAuthConfig(req);
    const res = createResponse();
    const session = await getServerSession<any, { user: { id: string, roles: string[] } | null }>(req as any, res as any, authConfig as any);

    return session?.user ? { id: session.user.id, roles: session.user.roles } : null;
}

/**
 * The account an `Authorization: Bearer` API token belongs to, or `null` when
 * the request carries no token. An unknown token resolves to `null` as well, so
 * the caller is anonymous and the access gate answers `API_LOGIN_REQUIRED`.
 * SEE: server/apiTokens.ts
 */
export const verifyApiToken = async (req: IncomingMessage, client: MongoClient) => {

    const token = getApiTokenFromHeaders(req.headers as Record<string, string | string[] | undefined>);

    if (!token) {
        return null;
    }

    const user = await findUserByApiToken(client, token);

    return user ? { ...user, viaApiToken: true } : null;
}

export const context = async ({ req, client }: { req: IncomingMessage, client: MongoClient }) => {

    try {

        // A token wins over a cookie: a script sends one deliberately, while a
        // cookie may be riding along by accident.
        const user = await verifyApiToken(req, client) ?? await verifyToken(req);

        return { user, req, client };
    }
    catch (e) {

        console.error(e as Error);

        throw e;
    }
}