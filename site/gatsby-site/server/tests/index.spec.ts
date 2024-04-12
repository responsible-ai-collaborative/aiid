import { ApolloServer } from "@apollo/server";
import request from 'supertest';
import { startTestServer } from "./utils";

describe('e2e demo', () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    it(`Throws 400`, async () => {

        const response = await request(url).post('/');

        expect(response.statusCode).toBe(400);
    });
});