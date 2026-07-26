import { expect, it, describe, beforeAll, afterAll } from '@jest/globals';
import { ApolloServer } from '@apollo/server';
import {
    getCollection,
    makeRequest,
    mockAnonymousSession,
    mockSession,
    seedFixture,
    startTestServer,
} from './utils';
import {
    API_ACCESS_BLOCKED,
    API_ACCESS_BLOCKED_MESSAGE,
    API_LOGIN_REQUIRED,
    API_LOGIN_REQUIRED_MESSAGE,
    clearApiAccessCache,
} from '../apiAccess';

/**
 * Covers the API access gate: that a session is required, that a blocked account
 * is refused, and that an account cannot lift its own block.
 * SEE: server/apiAccess.ts
 */
describe('API access gate', () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    const seedUsers = () =>
        seedFixture({
            customData: {
                users: [
                    { userId: 'subscriber1', roles: ['subscriber'], first_name: 'Sub', last_name: 'One' },
                    { userId: 'admin1', roles: ['admin'], first_name: 'Ad', last_name: 'Min' },
                    { userId: 'blocked1', roles: ['subscriber'], first_name: 'Blocked', last_name: 'One' },
                ],
            },
            aiidprod: {
                incidents: [
                    {
                        incident_id: 1,
                        title: 'Incident 1',
                        description: 'Incident 1 description',
                        date: '2020-01-01',
                        editors: ['admin1'],
                        reports: [],
                        'Alleged deployer of AI system': [],
                        'Alleged developer of AI system': [],
                        'Alleged harmed or nearly harmed parties': [],
                    },
                ],
            },
        });

    const incidentsQuery = {
        query: `query GateProbe { incidents { incident_id title } }`,
    };

    it('denies a query with no session, with the login-required code and message', async () => {
        await seedUsers();

        mockAnonymousSession();

        const response = await makeRequest(url, incidentsQuery);

        expect(response.body.data).toMatchObject({ incidents: null });

        expect(response.body.errors[0]).toMatchObject({
            message: API_LOGIN_REQUIRED_MESSAGE,
            extensions: { code: API_LOGIN_REQUIRED },
        });
    });

    it('denies a mutation with no session', async () => {
        await seedUsers();

        mockAnonymousSession();

        // `flagIncidentSimilarity` was one of the mutations that used to be `allow`,
        // i.e. writable by an anonymous caller.
        const response = await makeRequest(url, {
            query: `mutation GateMutationProbe {
                flagIncidentSimilarity(incidentId: 1, dissimilarIds: []) {
                    incident_id
                }
            }`,
        });

        expect(response.body.errors[0]).toMatchObject({
            extensions: { code: API_LOGIN_REQUIRED },
        });
    });

    it('allows a logged-in user with no roles, since the gate checks identity and not permission', async () => {
        await seedUsers();

        mockSession('subscriber1');

        const response = await makeRequest(url, incidentsQuery);

        expect(response.body.errors).toBeUndefined();

        expect(response.body.data.incidents).toMatchObject([{ incident_id: 1, title: 'Incident 1' }]);
    });

    it('refuses a blocked account and reports the reason', async () => {
        await seedUsers();

        await getCollection('customData', 'users').updateOne(
            { userId: 'blocked1' },
            {
                $set: {
                    api_access_blocked: true,
                    api_access_blocked_at: new Date(),
                    api_access_blocked_reason: 'Automated scraping',
                },
            }
        );

        mockSession('blocked1');

        const response = await makeRequest(url, incidentsQuery);

        expect(response.body.data).toMatchObject({ incidents: null });

        expect(response.body.errors[0]).toMatchObject({
            message: API_ACCESS_BLOCKED_MESSAGE,
            extensions: { code: API_ACCESS_BLOCKED, reason: 'Automated scraping' },
        });
    });

    it('restores access when the block is lifted', async () => {
        await seedUsers();

        const users = getCollection('customData', 'users');

        await users.updateOne({ userId: 'blocked1' }, { $set: { api_access_blocked: true } });

        mockSession('blocked1');

        expect((await makeRequest(url, incidentsQuery)).body.errors[0].extensions.code).toBe(
            API_ACCESS_BLOCKED
        );

        await users.updateOne({ userId: 'blocked1' }, { $set: { api_access_blocked: false } });

        // The gate caches the flag for a few seconds, so the cache is dropped
        // rather than waiting out the TTL. SEE: server/apiAccess.ts
        clearApiAccessCache();

        const response = await makeRequest(url, incidentsQuery);

        expect(response.body.errors).toBeUndefined();

        expect(response.body.data.incidents).toHaveLength(1);
    });

    it('leaves schema introspection reachable without a session, so the explorer still loads', async () => {
        await seedUsers();

        mockAnonymousSession();

        const response = await makeRequest(url, {
            query: `query IntrospectionProbe { __schema { queryType { name } } }`,
        });

        expect(response.body.errors).toBeUndefined();

        expect(response.body.data.__schema.queryType.name).toBe('Query');
    });

    describe('protected user fields are admin-only', () => {

        it('refuses a non-admin granting themselves a role', async () => {
            await seedUsers();

            mockSession('subscriber1');

            const response = await makeRequest(url, {
                query: `mutation EscalateProbe {
                    updateOneUser(
                        filter: { userId: { EQ: "subscriber1" } }
                        update: { set: { roles: ["admin"] } }
                    ) {
                        userId
                        roles
                    }
                }`,
            });

            expect(response.body.errors[0].message).toBe('not authorized');

            // `admin` governs blocking accounts and reading other accounts' usage,
            // so a self-service route to it would undo both. Asserted against the
            // database as well as the response, because the mutation must not have
            // taken effect.
            expect(
                await getCollection('customData', 'users').findOne({ userId: 'subscriber1' })
            ).toMatchObject({ roles: ['subscriber'] });
        });

        it('allows an admin to change another account\'s roles', async () => {
            await seedUsers();

            mockSession('admin1');

            const response = await makeRequest(url, {
                query: `mutation AdminRolesProbe {
                    updateOneUser(
                        filter: { userId: { EQ: "subscriber1" } }
                        update: { set: { roles: ["subscriber", "incident_editor"] } }
                    ) {
                        userId
                        roles
                    }
                }`,
            });

            expect(response.body.errors).toBeUndefined();

            expect(response.body.data.updateOneUser.roles).toEqual(['subscriber', 'incident_editor']);
        });
    });

    describe('blocking is admin-only', () => {
        const blockSelf = (userId: string) => ({
            query: `mutation BlockProbe($userId: String) {
                updateOneUser(
                    filter: { userId: { EQ: $userId } }
                    update: { set: { api_access_blocked: false } }
                ) {
                    userId
                    api_access_blocked
                }
            }`,
            variables: { userId },
        });

        it('refuses a non-admin writing the API-access fields on their own record', async () => {
            await seedUsers();

            mockSession('subscriber1');

            const response = await makeRequest(url, blockSelf('subscriber1'));

            expect(response.body.errors[0].message).toBe('not authorized');
        });

        it('allows an admin to block an account', async () => {
            await seedUsers();

            mockSession('admin1');

            const response = await makeRequest(url, {
                query: `mutation AdminBlockProbe {
                    updateOneUser(
                        filter: { userId: { EQ: "subscriber1" } }
                        update: { set: { api_access_blocked: true, api_access_blocked_reason: "Abuse" } }
                    ) {
                        userId
                        api_access_blocked
                        api_access_blocked_reason
                    }
                }`,
            });

            expect(response.body.errors).toBeUndefined();

            expect(response.body.data.updateOneUser).toMatchObject({
                userId: 'subscriber1',
                api_access_blocked: true,
                api_access_blocked_reason: 'Abuse',
            });
        });

        it('still lets a non-admin edit their own profile, so the new rule has not over-reached', async () => {
            await seedUsers();

            mockSession('subscriber1');

            const response = await makeRequest(url, {
                query: `mutation ProfileProbe {
                    updateOneUser(
                        filter: { userId: { EQ: "subscriber1" } }
                        update: { set: { first_name: "Renamed" } }
                    ) {
                        userId
                        first_name
                    }
                }`,
            });

            expect(response.body.errors).toBeUndefined();

            expect(response.body.data.updateOneUser).toMatchObject({
                userId: 'subscriber1',
                first_name: 'Renamed',
            });
        });
    });
});
