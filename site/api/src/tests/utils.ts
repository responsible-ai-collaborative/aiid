import { startStandaloneServer } from "@apollo/server/standalone";
import { createServer } from "../server";
import { context } from "../context";
import { MongoClient } from "mongodb";

export const startTestServer = async () => {

    const server = await createServer();

    const { url } = await startStandaloneServer(server, { context, listen: { port: 0 } });

    return { server, url }
}

export const seedCollection = async ({ name, docs }: { name: string, docs: Record<string, unknown>[] }) => {

    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING!);

    const db = client.db('aiidprod');
    const collection = db.collection(name);

    const result = await collection.insertMany(docs);

    return result;
}