import { expect, it, describe, beforeAll, afterAll } from '@jest/globals';
import { ApolloServer } from '@apollo/server';
import { getCollection, makeRequest, mockSession, seedFixture, startTestServer } from './utils';

/**
 * A new Incident ID can be created for reports that already exist, and doing so
 * leaves those reports linked to the incidents they already belong to: one report
 * may be the underlying report of several incidents. SEE: #4052
 */
describe('Creating an incident from existing reports', () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    const seed = () => seedFixture({
        customData: {
            users: [{ userId: 'editor1', roles: ['incident_editor'] }],
        },
        aiidprod: {
            incidents: [
                {
                    incident_id: 1,
                    title: 'Incident 1',
                    description: 'Incident 1 description',
                    date: '2020-01-01',
                    editor_notes: '',
                    editors: [],
                    reports: [1, 2],
                    flagged_dissimilar_incidents: [],
                    'Alleged deployer of AI system': [],
                    'Alleged developer of AI system': [],
                    'Alleged harmed or nearly harmed parties': [],
                    implicated_systems: [],
                    embedding: { vector: [1, 0], from_reports: [1, 2] },
                },
            ],
            reports: [
                { report_number: 1, title: 'Report 1', embedding: { vector: [1, 0], from_text_hash: 'a' } },
                { report_number: 2, title: 'Report 2', embedding: { vector: [0, 1], from_text_hash: 'b' } },
            ],
            entities: [],
        },
        history: { incidents: [] },
    });

    const insert = (reportNumbers: number[]) => makeRequest(url, {
        query: `mutation ($data: IncidentInsertType!) {
            insertOneIncident(data: $data) { incident_id reports { report_number } embedding { vector from_reports } }
        }`,
        variables: {
            data: {
                incident_id: 2,
                title: 'Incident 2',
                description: 'A second incident covered by the same article',
                date: '2020-02-02',
                editor_notes: '',
                flagged_dissimilar_incidents: [],
                reports: { link: reportNumbers },
                editors: { link: [] },
            },
        },
    });

    it('links the existing reports to the new incident without unlinking them from their incidents', async () => {
        await seed();

        mockSession('editor1');

        const response = await insert([2]);

        expect(response.body.errors).toBeUndefined();

        expect(response.body.data.insertOneIncident).toMatchObject({
            incident_id: 2,
            reports: [{ report_number: 2 }],
        });

        // Report 2 now belongs to both incidents.
        const incidents = await getCollection('aiidprod', 'incidents').find({ reports: 2 }).sort({ incident_id: 1 }).toArray();

        expect(incidents.map((i) => i.incident_id)).toEqual([1, 2]);

        // The first incident is untouched, embedding included.
        expect(incidents[0]).toMatchObject({ reports: [1, 2], embedding: { vector: [1, 0], from_reports: [1, 2] } });
    });

    it('computes the new incident\'s embedding from the linked reports', async () => {
        await seed();

        mockSession('editor1');

        const response = await insert([1, 2]);

        expect(response.body.errors).toBeUndefined();

        expect(response.body.data.insertOneIncident.embedding).toMatchObject({ from_reports: [1, 2] });

        expect(response.body.data.insertOneIncident.embedding.vector).toHaveLength(2);
    });

    it('refuses a report number that does not exist', async () => {
        await seed();

        mockSession('editor1');

        const response = await insert([999]);

        expect(response.body.errors[0].message).toMatch(/999/);

        expect(await getCollection('aiidprod', 'incidents').countDocuments({ incident_id: 2 })).toBe(0);
    });
});
