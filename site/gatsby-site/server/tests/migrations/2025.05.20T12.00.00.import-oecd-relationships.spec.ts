import { MongoClient } from 'mongodb';
import { getClient, getCollection } from '../utils';
import { up as importOecdRelationshipsUp } from '../../../migrations/2025.05.20T12.00.00.import-oecd-relationships';
import oecdRelationshipsData from '../../../migrations/data/oecd_relationships.json';


describe('Migration: 2025.05.20T12.00.00.import-oecd-relationships', () => {

    let client: MongoClient;

    beforeAll(async () => {

        client = getClient();
    });

    test('should import relationships from migrations/data/oecd_relationships.json', async () => {

        await importOecdRelationshipsUp({ context: { client } } as any);

        const importedDocs = await getCollection('aiidprod', 'incident_links').find().toArray();

        expect(importedDocs.length).toBe(oecdRelationshipsData.length);

        if (importedDocs.length > 0 && oecdRelationshipsData.length > 0) {
            const firstDoc = importedDocs[0];
            const firstDataEntry = oecdRelationshipsData[0];
            expect(firstDoc).toHaveProperty('incident_id', firstDataEntry.incident_id);
            expect(firstDoc).toHaveProperty('sameAs', firstDataEntry.sameAs);
            expect(firstDoc).toHaveProperty('source_namespace', firstDataEntry.source_namespace);
        }
    });
});
