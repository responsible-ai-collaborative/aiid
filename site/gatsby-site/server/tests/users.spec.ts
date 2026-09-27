import { expect, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { makeRequest, mockAnonymousSession, mockSession, seedFixture, startTestServer } from "./utils";
import { API_LOGIN_REQUIRED } from "../apiAccess";

describe(`Users`, () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    const seedTwoUsers = () => seedFixture({
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

    it(`Should deny anonymous querying of users' public data`, async () => {

        // The API used to serve this to anyone. It now requires a session, so that
        // requests can be attributed to an account, counted and blocked.
        // SEE: server/apiAccess.ts and site/docs/API_ACCESS.md
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

        await seedTwoUsers();

        mockAnonymousSession()

        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({ users: null });

        expect(response.body.errors[0].extensions.code).toBe(API_LOGIN_REQUIRED);
    });

    it(`Should allow any logged-in user to query users' public data`, async () => {

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

        await seedTwoUsers();

        // A subscriber, i.e. the least-privileged real account: the gate asks for
        // identity, not permission, so public fields stay readable.
        mockSession('user1')

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

    it(`Should deny a non-admin querying of users' private data`, async () => {

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

        await seedTwoUsers();

        // Acted by a logged-in subscriber rather than an anonymous caller, so what
        // is under test is still the `adminData` role check and not the login gate
        // that would now reject the request before reaching it.
        mockSession('user1')

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
