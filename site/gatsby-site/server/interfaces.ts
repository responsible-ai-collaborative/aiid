import { MongoClient } from 'mongodb';
import { Submission } from './generated/graphql';

export interface Context {
    user: {
        id: string,
        roles: string[],
    } | null,
    req: Request,
    client: MongoClient,
}

export type DBSubmission = Omit<Submission, 'developers' | 'deployers' | 'harmed_parties' | 'user' | 'incident_editors'>
    & { developers: string[] }
    & { deployers: string[] }
    & { harmed_parties: string[] }
    & { user: string }
    & { incident_editors: string[] }