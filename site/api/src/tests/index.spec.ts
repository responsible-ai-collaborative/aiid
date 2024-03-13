import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from "@apollo/server";
import request from 'supertest';
import { context } from "../context";
import { createServer } from "../server";

describe('e2e demo', () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        server = await createServer();
        ({ url } = await startStandaloneServer(server, { context, listen: { port: 0 } }))

        console.log(`Test server started at ${url}`);
    });

    afterAll(async () => {
        await server?.stop();
    });

    it(`Throws 400`, async () => {

        const response = await request(url).post('/');

        expect(response.statusCode).toBe(400);
    });
});