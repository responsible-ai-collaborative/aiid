import { MongoClient } from 'mongodb';

export interface Context {
    user: {
        id: string,
        roles: string[],
    } | null,
    req: Request,
    client: MongoClient,
}
