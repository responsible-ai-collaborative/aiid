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

    it(`Should give an admin every account's admin data in the list query, in one request`, async () => {

        // The admin page's table used to fetch `adminData` with one `FindUser`
        // request per account, which tripped the per-IP rate limit on the API as
        // soon as there were more accounts than the limit allows; the list query
        // carries it for admins.
        const { ObjectId } = require('bson');

        const ids = [new ObjectId(), new ObjectId(), new ObjectId()];

        await seedFixture({
            customData: {
                users: [
                    { userId: ids[0].toString(), roles: ['subscriber'], first_name: 'A', last_name: 'One' },
                    { userId: ids[1].toString(), roles: ['incident_editor'], first_name: 'B', last_name: 'Two' },
                    { userId: ids[2].toString(), roles: ['admin'], first_name: 'C', last_name: 'Three' },
                ],
            },
            auth: {
                users: [
                    { _id: ids[0], email: 'one@example.com', emailVerified: new Date().toString() },
                    // ids[1] has no auth record (an anonymised or deleted account): no email, no error
                    { _id: ids[2], email: 'three@example.com', emailVerified: new Date().toString() },
                ],
            },
        });

        mockSession(ids[2].toString());

        const response = await makeRequest(url, {
            query: `
                query FindUsersAdmin {
                    users {
                        userId
                        roles
                        adminData {
                            email
                        }
                    }
                }
            `,
        });

        expect(response.body.errors).toBeUndefined();

        const byId = Object.fromEntries(response.body.data.users.map((u: any) => [u.userId, u.adminData?.email ?? null]));

        expect(byId).toEqual({
            [ids[0].toString()]: 'one@example.com',
            [ids[1].toString()]: null,
            [ids[2].toString()]: 'three@example.com',
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
