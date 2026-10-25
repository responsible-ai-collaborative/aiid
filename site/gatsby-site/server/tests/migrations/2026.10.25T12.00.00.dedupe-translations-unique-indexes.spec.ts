import { MongoClient } from 'mongodb';
import { getClient, getCollection, seedFixture } from '../utils';
import { pickKeeper, up } from '../../../migrations/2026.10.25T12.00.00.dedupe-translations-unique-indexes';

describe('Migration: 2026.10.25T12.00.00.dedupe-translations-unique-indexes', () => {

    let client: MongoClient;

    beforeAll(async () => {
        client = getClient();
    });

    afterAll(async () => {
        // Other specs read these collections without seeding them, so leave no documents
        // or unique indexes behind (Jest runs every spec against the same database)
        await seedFixture({ translations: { reports: [], incidents: [] } });

        await client.close();
    });

    beforeEach(async () => {
        await seedFixture({
            translations: {
                reports: [
                    // Report 1 in Japanese: the original translation went dirty when the report was
                    // edited, then the old update bug re-inserted a fresh translation every day.
                    { report_number: 1, language: 'ja', title: 'old ja', text: 'old ja', plain_text: 'old ja', dirty: true, created_at: new Date('2026-09-09') },
                    { report_number: 1, language: 'ja', title: 'ja 10', text: 'ja 10', plain_text: 'ja 10', dirty: false, created_at: new Date('2026-09-10') },
                    { report_number: 1, language: 'ja', title: 'ja 11', text: 'ja 11', plain_text: 'ja 11', dirty: false, created_at: new Date('2026-09-11') },
                    { report_number: 1, language: 'fr', title: 'fr', text: 'fr', plain_text: 'fr', dirty: false, created_at: new Date('2026-09-09') },
                    // Report 2 in Spanish: both copies dirty, so the newer one stays and is re-translated
                    { report_number: 2, language: 'es', title: 'es old', text: 'es old', plain_text: 'es old', dirty: true, created_at: new Date('2026-01-01') },
                    { report_number: 2, language: 'es', title: 'es new', text: 'es new', plain_text: 'es new', dirty: true, created_at: new Date('2026-02-01') },
                    // Report 3: legacy documents without created_at, the later _id wins
                    { report_number: 3, language: 'es', title: 'es first', text: 'es first', plain_text: 'es first' },
                    { report_number: 3, language: 'es', title: 'es second', text: 'es second', plain_text: 'es second' },
                ],
                incidents: [
                    { incident_id: 1, language: 'es', title: 'a', description: 'a', dirty: false, created_at: new Date('2026-01-01') },
                    { incident_id: 1, language: 'es', title: 'b', description: 'b', dirty: false, created_at: new Date('2026-01-02') },
                    { incident_id: 1, language: 'fr', title: 'c', description: 'c', dirty: false, created_at: new Date('2026-01-01') },
                ],
            },
        });

        // The non-unique index production has on the reports collection
        const reports = getCollection('translations', 'reports');

        await reports.dropIndexes();
        await reports.createIndex({ report_number: 1, language: 1 }, { name: 'report_number_language_idx' });
    });

    test('keeps one translation per (id, language), preferring a clean and recent one, and adds unique indexes', async () => {

        await up({ context: { client } } as any);

        const reports = await getCollection('translations', 'reports').find({}).sort({ report_number: 1, language: 1 }).toArray();

        expect(reports.map((r) => [r.report_number, r.language, r.title, r.dirty])).toEqual([
            [1, 'fr', 'fr', false],
            [1, 'ja', 'ja 11', false],
            [2, 'es', 'es new', true],
            [3, 'es', 'es second', undefined],
        ]);

        const incidents = await getCollection('translations', 'incidents').find({}).sort({ incident_id: 1, language: 1 }).toArray();

        expect(incidents.map((i) => [i.incident_id, i.language, i.title])).toEqual([
            [1, 'es', 'b'],
            [1, 'fr', 'c'],
        ]);

        const reportIndexes = await getCollection('translations', 'reports').indexes();

        expect(reportIndexes.find((i) => i.name === 'report_number_language_unique')).toMatchObject({ unique: true, key: { report_number: 1, language: 1 } });
        expect(reportIndexes.find((i) => i.name === 'report_number_language_idx')).toBeUndefined();

        const incidentIndexes = await getCollection('translations', 'incidents').indexes();

        expect(incidentIndexes.find((i) => i.name === 'incident_id_language_unique')).toMatchObject({ unique: true, key: { incident_id: 1, language: 1 } });
    });

    test('is idempotent', async () => {

        await up({ context: { client } } as any);

        const before = await getCollection('translations', 'reports').find({}).sort({ _id: 1 }).toArray();

        await up({ context: { client } } as any);

        const after = await getCollection('translations', 'reports').find({}).sort({ _id: 1 }).toArray();

        expect(after).toEqual(before);
    });

    test('the indexes refuse a duplicate translation', async () => {

        await up({ context: { client } } as any);

        await expect(
            getCollection('translations', 'reports').insertOne({ report_number: 1, language: 'ja', title: 'x', text: 'x', plain_text: 'x' })
        ).rejects.toMatchObject({ code: 11000 });

        await expect(
            getCollection('translations', 'incidents').insertOne({ incident_id: 1, language: 'fr', title: 'x', description: 'x' })
        ).rejects.toMatchObject({ code: 11000 });

        // A different language for the same report is still fine
        await expect(
            getCollection('translations', 'reports').insertOne({ report_number: 1, language: 'es', title: 'x', text: 'x', plain_text: 'x' })
        ).resolves.toBeTruthy();
    });

    test('pickKeeper prefers clean over dirty, then the most recent', () => {

        const { ObjectId } = require('mongodb');

        const docs = [
            { _id: new ObjectId('65000000ab0000000000000a'), dirty: true, created_at: new Date('2026-09-20') },
            { _id: new ObjectId('65000000ab0000000000000b'), dirty: false, created_at: new Date('2026-09-10') },
            { _id: new ObjectId('65000000ab0000000000000c'), dirty: false, created_at: new Date('2026-09-11') },
        ];

        expect(pickKeeper(docs)._id.toHexString()).toBe('65000000ab0000000000000c');
        expect(pickKeeper(docs.slice(0, 1))._id.toHexString()).toBe('65000000ab0000000000000a');
    });
});
