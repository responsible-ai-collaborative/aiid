import { IncomingMessage } from "http";
import { MongoClient } from "mongodb";
import * as reporter from "./reporter";
import { getServerSession } from 'next-auth'
import { getAuthConfig } from "../nextauth.config";
import { createResponse } from '../src/utils/serverless'

export const context = async ({ req, client }: { req: IncomingMessage, client: MongoClient }) => {

    try {

        const authConfig = await getAuthConfig();
        const res = createResponse();
        const session = await getServerSession<any, { user: { id: string, roles: string[] } | null }>(req as any, res as any, authConfig as any);

        const user = session?.user ? { id: session.user.id, roles: session.user.roles } : null;

        return { user, req, client };
    }
    catch (e) {

        reporter.error(e as Error);

        throw e;
    }
}