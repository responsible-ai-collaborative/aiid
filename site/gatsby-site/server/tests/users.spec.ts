import { expect, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { makeRequest, mockSession, seedFixture, startTestServer } from "./utils";

describe(`Users`, () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    it(`Should allow anonymous querying of users' public data`, async () => {

        const mutationData = {
            query: `
                query {
                    users {
                        userId
                        roles
                    }
                }
                    `,
        };

        await seedFixture({
            customData: {
                users: [
                    {
                        userId: "user1",
                        roles: ['subscriber'],
                    },
                    {
                        userId: "user2",
                        roles: ['admin'],
                    }
                ],
            },
        });


        mockSession('123')

        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({
            users: [
                {
                    userId: "user1",
                    roles: [
                        "subscriber",
                    ],
                },
                {
                    userId: "user2",
                    roles: [
                        "admin",
                    ],
                },
            ]
        });
    });

    it(`Should deny anonymous querying of users' private data`, async () => {

        const mutationData = {
            query: `
                query {
                    users {
                        userId
                        roles
                        adminData {
                            email
                        }
                    }
                }
                    `,
        };

        await seedFixture({
            customData: {
                users: [
                    {
                        userId: "user1",
                        roles: ['subscriber'],
                    },
                    {
                        userId: "user2",
                        roles: ['admin'],
                    }
                ],
            },
        });


        mockSession('123')

        const response = await makeRequest(url, mutationData);

        expect(response.body).toMatchObject({
            data: {
                users: null,
            },
            errors: [
                {
                    message: "not authorized",
                    path: [
                        "users",
                    ],
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                    },
                },
            ]
        });
    });

    it(`Should allow user with admin role querying of users' private data`, async () => {

        const mutationData = {
            query: `
                query {
                    users {
                        userId
                        roles
                        adminData {
                            email
                        }
                    }
                }
                    `,
        };

        await seedFixture({
            customData: {
                users: [
                    {
                        userId: "user1",
                        roles: ['subscriber'],
                    },
                    {
                        userId: "user2",
                        roles: ['admin'],
                    }
                ],
            },
        });


        mockSession("user2")

        const response = await makeRequest(url, mutationData);

        expect(response.body).toMatchObject({
            data: {
                users: [
                    {
                        userId: "user1",
                        roles: [
                            "subscriber",
                        ],
                    },
                    {
                        userId: "user2",
                        roles: [
                            "admin",
                        ],
                    },
                ],
            }
        });
    });
});
