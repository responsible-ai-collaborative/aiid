import { expect, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { getCollection, makeRequest, mockSession, seedFixture, startTestServer } from "./utils";

const UPDATE_ROLES = `
    mutation UpdateRoles($userId: String, $roles: [String]!) {
        updateOneUser(filter: { userId: { EQ: $userId } }, update: { set: { roles: $roles } }) {
            userId
            roles
        }
    }
`;

const UPDATE_PROFILE = `
    mutation UpdateProfile($userId: String, $first_name: String, $last_name: String) {
        updateOneUser(
            filter: { userId: { EQ: $userId } }
            update: { set: { first_name: $first_name, last_name: $last_name } }
        ) {
            userId
            first_name
            last_name
        }
    }
`;

describe(`Privilege escalation`, () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    beforeEach(async () => {
        await seedFixture({
            customData: {
                users: [
                    { userId: "subscriber1", roles: ['subscriber'], first_name: 'Sub', last_name: 'Scriber' },
                    { userId: "victim1", roles: ['subscriber'], first_name: 'Vic', last_name: 'Tim' },
                    { userId: "admin1", roles: ['admin'], first_name: 'Ad', last_name: 'Min' },
                ],
            },
        });
    });

    it(`Should not allow a user to grant themselves a role`, async () => {

        mockSession('subscriber1');

        const response = await makeRequest(url, {
            query: UPDATE_ROLES,
            variables: { userId: 'subscriber1', roles: ['admin'] },
        });

        expect(response.body.errors[0].message).toBe('not authorized');

        const stored = await getCollection('customData', 'users').findOne({ userId: 'subscriber1' });

        expect(stored?.roles).toEqual(['subscriber']);
    });

    it(`Should not allow a user to change another user's roles`, async () => {

        mockSession('subscriber1');

        const response = await makeRequest(url, {
            query: UPDATE_ROLES,
            variables: { userId: 'victim1', roles: ['admin'] },
        });

        expect(response.body.errors[0].message).toBe('not authorized');

        const stored = await getCollection('customData', 'users').findOne({ userId: 'victim1' });

        expect(stored?.roles).toEqual(['subscriber']);
    });

    it(`Should not allow an anonymous user to change roles`, async () => {

        mockSession('nobody');

        const response = await makeRequest(url, {
            query: UPDATE_ROLES,
            variables: { userId: 'subscriber1', roles: ['admin'] },
        });

        expect(response.body.errors[0].message).toBe('not authorized');

        const stored = await getCollection('customData', 'users').findOne({ userId: 'subscriber1' });

        expect(stored?.roles).toEqual(['subscriber']);
    });

    it(`Should still allow a user to update their own profile`, async () => {

        mockSession('subscriber1');

        const response = await makeRequest(url, {
            query: UPDATE_PROFILE,
            variables: { userId: 'subscriber1', first_name: 'New', last_name: 'Name' },
        });

        expect(response.body.data.updateOneUser).toMatchObject({
            userId: 'subscriber1',
            first_name: 'New',
            last_name: 'Name',
        });
    });

    it(`Should not allow a user to update another user's profile`, async () => {

        mockSession('subscriber1');

        const response = await makeRequest(url, {
            query: UPDATE_PROFILE,
            variables: { userId: 'victim1', first_name: 'Hacked', last_name: 'Hacked' },
        });

        expect(response.body.errors[0].message).toBe('not authorized');

        const stored = await getCollection('customData', 'users').findOne({ userId: 'victim1' });

        expect(stored?.first_name).toBe('Vic');
    });

    it(`Should allow an admin to update roles`, async () => {

        mockSession('admin1');

        const response = await makeRequest(url, {
            query: UPDATE_ROLES,
            variables: { userId: 'subscriber1', roles: ['subscriber', 'incident_editor'] },
        });

        expect(response.body.data.updateOneUser).toMatchObject({
            userId: 'subscriber1',
            roles: ['subscriber', 'incident_editor'],
        });
    });
});
