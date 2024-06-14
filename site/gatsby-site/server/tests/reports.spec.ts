import { ApolloServer } from "@apollo/server";
import request from 'supertest';
import { startTestServer } from "./utils";

describe('Reports', () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    it(`report query aliased translations`, async () => {

        const queryData = {
            query: `
            query {
                report(query: { report_number: 1991 }) {
                    title
                    translations_es: translations(input: "es") {
                        title
                    }
                }
            }
            `,
        };

        const response = await request(url).post('/').send(queryData);

        expect(response.body.data).toMatchObject({
            report: {
                title: expect.any(String),
                translations_es: {
                    title: expect.any(String)
                }
            }
        })
    });
});