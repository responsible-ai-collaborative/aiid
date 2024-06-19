import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "../schema";
import { context } from "../context";
import { MongoClient } from "mongodb";
import { ApolloServer } from "@apollo/server";
import config from '../config';

export const startTestServer = async () => {

    const server = new ApolloServer({
        schema,
    });

    const client = new MongoClient(config.API_MONGODB_CONNECTION_STRING);

    const { url } = await startStandaloneServer(server, { context: ({ req }) => context({ req, client }), listen: { port: 0 } });

    return { server, url }
}

export const seedCollection = async ({ name, docs, database = 'aiidprod', drop = true }: { name: string, database?: string, docs: Record<string, unknown>[], drop?: boolean }) => {

    const client = new MongoClient(process.env.API_MONGODB_CONNECTION_STRING!);

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