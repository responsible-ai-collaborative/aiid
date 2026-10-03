import { expect, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { getCollection, makeRequest, mockAnonymousSession, mockSession, seedFixture, startTestServer } from "./utils";
import { API_ACCESS_BLOCKED, API_LOGIN_REQUIRED } from "../apiAccess";
import { API_TOKEN_PATTERN, generateApiToken, getApiTokenFromHeaders, hasApiTokenHeader } from "../apiTokens";

const TOKEN_A = 'aiid_' + 'a'.repeat(40);
const TOKEN_B = 'aiid_' + 'b'.repeat(40);

const seed = async () => {
    await seedFixture({
        customData: {
            users: [
                { userId: 'user-a', roles: ['subscriber'], first_name: 'A', last_name: 'One', api_token: TOKEN_A, api_token_request_count: 0 },
                { userId: 'user-b', roles: ['admin'], first_name: 'B', last_name: 'Two', api_token: TOKEN_B },
            ],
        },
    });
};

const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

const userQuery = (userId: string) => ({
    query: `query { user(filter: { userId: { EQ: "${userId}" } }) { userId roles api_token api_token_request_count api_token_last_used_at } }`,
});

describe('API tokens', () => {

    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    describe('token format', () => {

        it('generates long random tokens with the prefix', () => {

            const tokens = new Set(Array.from({ length: 200 }, () => generateApiToken()));

            expect(tokens.size).toBe(200);

            for (const token of tokens) {
                expect(token).toMatch(API_TOKEN_PATTERN);
                expect(token).toHaveLength(45);
            }
        });

        it('reads a Bearer token from the Authorization header', () => {

            expect(getApiTokenFromHeaders({ authorization: `Bearer ${TOKEN_A}` })).toBe(TOKEN_A);
            expect(getApiTokenFromHeaders({ Authorization: `bearer ${TOKEN_A}` })).toBe(TOKEN_A);
            expect(getApiTokenFromHeaders({ authorization: 'Basic abc' })).toBeNull();
            expect(getApiTokenFromHeaders({})).toBeNull();
            expect(getApiTokenFromHeaders(undefined)).toBeNull();

            expect(hasApiTokenHeader({ authorization: `Bearer ${TOKEN_A}` })).toBe(true);
            expect(hasApiTokenHeader({ authorization: 'Bearer not-ours' })).toBe(false);
        });
    });

    describe('authentication', () => {

        beforeEach(seed);

        it('authenticates a request as the token\'s account, with no session', async () => {

            mockAnonymousSession();

            const response = await makeRequest(url, userQuery('user-a'), bearer(TOKEN_A));

            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.user).toMatchObject({ userId: 'user-a', roles: ['subscriber'], api_token: TOKEN_A });
        });

        it('totals token requests on the account, denied ones included', async () => {

            mockAnonymousSession();

            await makeRequest(url, userQuery('user-a'), bearer(TOKEN_A));
            await makeRequest(url, userQuery('user-a'), bearer(TOKEN_A));

            const user = await getCollection('customData', 'users').findOne({ userId: 'user-a' });

            expect(user?.api_token_request_count).toBe(2);
            expect(user?.api_token_last_used_at).toBeInstanceOf(Date);

            // A session request is not a token request
            mockSession('user-a');

            await makeRequest(url, userQuery('user-a'));

            expect((await getCollection('customData', 'users').findOne({ userId: 'user-a' }))?.api_token_request_count).toBe(2);
        });

        it('treats an unknown token as anonymous', async () => {

            mockAnonymousSession();

            const response = await makeRequest(url, userQuery('user-a'), bearer('aiid_' + 'z'.repeat(40)));

            expect(response.body.errors[0].extensions.code).toBe(API_LOGIN_REQUIRED);
            expect(response.body.data.user).toBeNull();
        });

        it('lets a token win over a session', async () => {

            mockSession('user-b');

            // Sent as B's session but A's token: the request is A's, so A's own token is readable.
            const response = await makeRequest(url, userQuery('user-a'), bearer(TOKEN_A));

            expect(response.body.data.user.api_token).toBe(TOKEN_A);
        });

        it('refuses a blocked account\'s token', async () => {

            await getCollection('customData', 'users').updateOne({ userId: 'user-a' }, { $set: { api_access_blocked: true, api_access_blocked_reason: 'testing' } });

            mockAnonymousSession();

            const response = await makeRequest(url, userQuery('user-a'), bearer(TOKEN_A));

            expect(response.body.errors[0].extensions.code).toBe(API_ACCESS_BLOCKED);

            // Still counted: the point is how much traffic the token brings.
            expect((await getCollection('customData', 'users').findOne({ userId: 'user-a' }))?.api_token_request_count).toBe(1);
        });
    });

    describe('visibility and edits', () => {

        beforeEach(seed);

        it('shows a token only to its own account, and the counters to admins too', async () => {

            mockSession('user-b');

            const asAdmin = await makeRequest(url, { query: `query { users { userId api_token api_token_request_count } }` });

            const a = asAdmin.body.data.users.find((u: any) => u.userId === 'user-a');
            const b = asAdmin.body.data.users.find((u: any) => u.userId === 'user-b');

            expect(a.api_token).toBeNull();
            expect(a.api_token_request_count).toBe(0);
            expect(b.api_token).toBe(TOKEN_B);

            mockSession('user-a');

            const asUser = await makeRequest(url, userQuery('user-b'));

            expect(asUser.body.data.user.api_token).toBeNull();
            expect(asUser.body.data.user.api_token_request_count).toBeNull();
        });

        it('refuses filtering or sorting by the token fields for non-admins', async () => {

            mockSession('user-a');

            const filtered = await makeRequest(url, { query: `query { users(filter: { api_token: { EQ: "${TOKEN_B}" } }) { userId } }` });

            expect(filtered.body.errors[0].message).toBe('not authorized');

            const sorted = await makeRequest(url, { query: `query { users(sort: { api_token_request_count: DESC }) { userId } }` });

            expect(sorted.body.errors[0].message).toBe('not authorized');

            mockSession('user-b');

            const asAdmin = await makeRequest(url, { query: `query { users(sort: { api_token_request_count: DESC }) { userId } }` });

            expect(asAdmin.body.errors).toBeUndefined();
        });

        it('never accepts a token through updateOneUser', async () => {

            const attempt = (actor: string, target: string) => makeRequest(url, {
                query: `mutation { updateOneUser(filter: { userId: { EQ: "${target}" } }, update: { set: { api_token: "aiid_${'x'.repeat(40)}" } }) { userId } }`,
            });

            mockSession('user-a');

            expect((await attempt('user-a', 'user-a')).body.errors[0].message).toMatch(/cannot be edited/);

            mockSession('user-b');

            expect((await attempt('user-b', 'user-a')).body.errors[0].message).toMatch(/cannot be edited/);

            expect((await getCollection('customData', 'users').findOne({ userId: 'user-a' }))?.api_token).toBe(TOKEN_A);
        });
    });

    describe('regenerateApiToken', () => {

        beforeEach(seed);

        const regenerate = (userId?: string) => makeRequest(url, {
            query: `mutation ($userId: String) { regenerateApiToken(userId: $userId) { userId api_token api_token_regenerated_at } }`,
            variables: { userId },
        });

        it('replaces the caller\'s token and invalidates the old one at once', async () => {

            mockSession('user-a');

            const response = await regenerate();

            expect(response.body.errors).toBeUndefined();

            const { api_token: fresh, api_token_regenerated_at } = response.body.data.regenerateApiToken;

            expect(fresh).toMatch(API_TOKEN_PATTERN);
            expect(fresh).not.toBe(TOKEN_A);
            expect(api_token_regenerated_at).toBeTruthy();

            mockAnonymousSession();

            expect((await makeRequest(url, userQuery('user-a'), bearer(TOKEN_A))).body.errors[0].extensions.code).toBe(API_LOGIN_REQUIRED);
            expect((await makeRequest(url, userQuery('user-a'), bearer(fresh))).body.data.user.userId).toBe('user-a');
        });

        it('lets an admin revoke another account\'s token without seeing it', async () => {

            mockSession('user-b');

            const response = await regenerate('user-a');

            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.regenerateApiToken.userId).toBe('user-a');
            expect(response.body.data.regenerateApiToken.api_token).toBeNull();

            const stored = await getCollection('customData', 'users').findOne({ userId: 'user-a' });

            expect(stored?.api_token).not.toBe(TOKEN_A);
            expect(stored?.api_token).toMatch(API_TOKEN_PATTERN);
        });

        it('refuses another account\'s token to a non-admin, and anyone anonymous', async () => {

            mockSession('user-a');

            expect((await regenerate('user-b')).body.errors[0].message).toBe('not authorized');

            mockAnonymousSession();

            expect((await regenerate()).body.errors[0].extensions.code).toBe(API_LOGIN_REQUIRED);

            expect((await getCollection('customData', 'users').findOne({ userId: 'user-b' }))?.api_token).toBe(TOKEN_B);
        });

        it('works with the token itself as the credential', async () => {

            mockAnonymousSession();

            const response = await makeRequest(url, {
                query: `mutation { regenerateApiToken { api_token } }`,
            }, bearer(TOKEN_A));

            expect(response.body.data.regenerateApiToken.api_token).toMatch(API_TOKEN_PATTERN);
            expect(response.body.data.regenerateApiToken.api_token).not.toBe(TOKEN_A);
        });
    });
});
