import { IncomingMessage } from "http";
import { MongoClient } from "mongodb";
import { getServerSession } from 'next-auth'
import { getAuthConfig } from "../nextauth.config";
import { createResponse } from '../src/utils/serverless'

export const verifyToken = async (req: IncomingMessage) => {

    const authConfig = await getAuthConfig(req);
    const res = createResponse();
    const session = await getServerSession<any, { user: { id: string, roles: string[] } | null }>(req as any, res as any, authConfig as any);

    return session?.user ? { id: session.user.id, roles: session.user.roles } : null;
}

export const context = async ({ req, client }: { req: IncomingMessage, client: MongoClient }) => {

    try {

        const user = await verifyToken(req);

        return { user, req, client };
    }
    catch (e) {

        console.error(e as Error);

        throw e;
    }
}