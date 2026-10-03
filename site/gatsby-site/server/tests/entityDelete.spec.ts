import { expect, it, describe, beforeAll, afterAll } from '@jest/globals';
import { ApolloServer } from '@apollo/server';
import { getCollection, makeRequest, mockSession, seedFixture, startTestServer } from './utils';

/**
 * Deleting an entity removes it and every reference to it. SEE: #4036 and
 * server/shared/entities.ts `deleteEntity`
 */
describe('Delete entity', () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    const seed = () => seedFixture({
        customData: {
            users: [
                { userId: 'editor1', roles: ['incident_editor'] },
                { userId: 'subscriber1', roles: ['subscriber'] },
            ],
            subscriptions: [
                { type: 'entity', entityId: 'acme', userId: 'subscriber1' },
                { type: 'entity', entityId: 'other', userId: 'subscriber1' },
            ],
        },
        aiidprod: {
            entities: [
                { entity_id: 'acme', name: 'Acme' },
                { entity_id: 'other', name: 'Other' },
            ],
            incidents: [
                {
                    incident_id: 1, title: 'Incident 1', description: 'd', date: '2020-01-01', editor_notes: '', editors: [], reports: [1],
                    flagged_dissimilar_incidents: [],
                    'Alleged deployer of AI system': ['acme', 'other'],
                    'Alleged developer of AI system': ['acme'],
                    'Alleged harmed or nearly harmed parties': ['other'],
                    implicated_systems: [],
                },
                {
                    incident_id: 2, title: 'Incident 2', description: 'd', date: '2020-01-02', editor_notes: '', editors: [], reports: [2],
                    flagged_dissimilar_incidents: [],
                    'Alleged deployer of AI system': ['other'],
                    'Alleged developer of AI system': [],
                    'Alleged harmed or nearly harmed parties': [],
                    implicated_systems: ['acme'],
                },
            ],
            submissions: [
                { title: 'Submission 1', developers: ['acme'], deployers: [], harmed_parties: ['acme'], implicated_systems: [] },
            ],
            entity_relationships: [
                { sub: 'acme', obj: 'other', is_symmetric: false, pred: 'related' },
                { sub: 'other', obj: 'acme', is_symmetric: false, pred: 'related' },
                { sub: 'other', obj: 'third', is_symmetric: false, pred: 'related' },
            ],
            entity_duplicates: [
                { duplicate_entity_id: 'acme-corp', true_entity_id: 'acme' },
            ],
        },
    });

    const mutation = (entityId: string) => makeRequest(url, {
        query: `mutation ($entityId: String!) {
            deleteEntity(entityId: $entityId) {
                entity_id incidents_updated submissions_updated relationships_deleted subscriptions_deleted
            }
        }`,
        variables: { entityId },
    });

    it('removes the entity and every reference to it, and reports what was touched', async () => {
        await seed();

        mockSession('editor1');

        const response = await mutation('acme');

        expect(response.body.errors).toBeUndefined();

        expect(response.body.data.deleteEntity).toEqual({
            entity_id: 'acme',
            incidents_updated: 2,
            submissions_updated: 1,
            relationships_deleted: 2,
            subscriptions_deleted: 1,
        });

        expect(await getCollection('aiidprod', 'entities').findOne({ entity_id: 'acme' })).toBeNull();

        const [incident1, incident2] = await getCollection('aiidprod', 'incidents').find({}).sort({ incident_id: 1 }).toArray();

        expect(incident1).toMatchObject({
            'Alleged deployer of AI system': ['other'],
            'Alleged developer of AI system': [],
            'Alleged harmed or nearly harmed parties': ['other'],
        });

        expect(incident2).toMatchObject({ 'Alleged deployer of AI system': ['other'], implicated_systems: [] });

        expect(await getCollection('aiidprod', 'submissions').findOne({ title: 'Submission 1' })).toMatchObject({
            developers: [],
            harmed_parties: [],
        });

        // Only relationships involving the entity are gone.
        const relationships = await getCollection('aiidprod', 'entity_relationships').find({}).toArray();

        expect(relationships.map((r) => `${r.sub}->${r.obj}`)).toEqual(['other->third']);

        // Only subscriptions to the entity are gone.
        expect(await getCollection('customData', 'subscriptions').countDocuments({ type: 'entity' })).toBe(1);

        // No duplicate record points at an entity that no longer exists.
        expect(await getCollection('aiidprod', 'entity_duplicates').countDocuments({ true_entity_id: 'acme' })).toBe(0);

        // The other entity is untouched.
        expect(await getCollection('aiidprod', 'entities').findOne({ entity_id: 'other' })).toMatchObject({ name: 'Other' });
    });

    it('refuses an entity that does not exist', async () => {
        await seed();

        mockSession('editor1');

        const response = await mutation('nope');

        expect(response.body.errors[0].message).toMatch(/not found/i);
    });

    it('is an editorial action: a subscriber may not delete an entity', async () => {
        await seed();

        mockSession('subscriber1');

        const response = await mutation('acme');

        expect(response.body.errors[0].message).toBe('not authorized');

        expect(await getCollection('aiidprod', 'entities').countDocuments({ entity_id: 'acme' })).toBe(1);
    });
});
