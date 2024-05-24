import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "../schema";
import { context } from "../context";
import { MongoClient } from "mongodb";
import { ApolloServer } from "@apollo/server";
import config from '../config';
import supertest from 'supertest';


export const startTestServer = async () => {

    const server = new ApolloServer({
        schema,
    });

    const { url } = await startStandaloneServer(server, { context, listen: { port: 0 } });

    return { server, url }
}

export const seedCollection = async ({ name, docs, database = 'aiidprod', drop = true }: { name: string, database?: string, docs: Record<string, unknown>[], drop?: boolean }) => {

    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING!);

    const db = client.db(database);
    const collection = db.collection(name);

    if (drop && (await db.listCollections().toArray()).find(c => c.name === name)) {

        await collection.drop();
    }

    if (docs.length) {

        const result = await collection.insertMany(docs);

        return result;
    }
}

export const readCollection = async ({ name, database = 'aiidprod' }: { name: string, database?: string }) => {

    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING!);

    const db = client.db(database);
    const collection = db.collection(name);

    return collection.find({}).toArray();
}


interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user_id: string;
}

export const login = async (username: string, password: string) => {

    const response = await fetch(`https://services.cloud.mongodb.com/api/client/v2.0/app/${config.REALM_APP_ID}/auth/providers/local-userpass/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
        })
    });

    if (!response.ok) {
        throw new Error(`Error login in! \n\n ${await response.text()}`);
    }

    const data: AuthResponse = await response.json();

    return data;
}

export const anonRequest = async (url: string, data: { variables?: Record<string, unknown>, query: string }) => {

    return supertest(url)
        .post('/')
        .send(data);
}

export const authRequest = async (url: string, data: { variables?: Record<string, unknown>, query: string }, roles: string[]) => {

    const authData = await login(config.E2E_ADMIN_USERNAME!, config.E2E_ADMIN_PASSWORD!);

    await seedCollection({
        name: 'users',
        database: 'customData',
        docs: [
            {
                userId: authData.user_id,
                roles,
            }
        ],
    });

    return supertest(url)
        .post('/')
        .set('Authorization', `Bearer ${authData.access_token}`)
        .send(data);
}

export const makeRequest = async (url: string, data: { variables?: Record<string, unknown>, query: string }, roles?: string[],) => {

    if (roles && roles.length) {
        return authRequest(url, data, roles);
    }

    return anonRequest(url, data);
}