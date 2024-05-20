import { IncomingMessage } from 'http';
import { MongoClient } from 'mongodb';

export interface Context {
    user: {
        id: string,
        roles: string[],
    } | null,
    req: IncomingMessage,
    client: MongoClient,
}