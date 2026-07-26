import { expect, it, describe, beforeAll, afterAll } from '@jest/globals';
import { ApolloServer } from '@apollo/server';
import {
    getCollection,
    makeRequest,
    mockAnonymousSession,
    mockSession,
    seedCollection,
    seedFixture,
    startTestServer,
} from './utils';
import { clearApiAccessCache } from '../apiAccess';
import {
    API_USAGE_COLLECTION,
    API_USAGE_DB,
    sanitizeOperationName,
    utcDayKey,
} from '../apiUsage';

/**
 * Covers the per-account request accounting.
 * SEE: server/apiUsage.ts
 */
describe('API usage accounting', () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    const usage = () => getCollection(API_USAGE_DB, API_USAGE_COLLECTION);

    const seedAll = async () => {
        await seedFixture({
            customData: {
                users: [
                    { userId: 'counted1', roles: ['subscriber'] },
                    { userId: 'admin1', roles: ['admin'] },
                    { userId: 'blocked1', roles: ['subscriber'] },
                ],
            },
            aiidprod: {
                incidents: [
                    {
                        incident_id: 1,
                        title: 'Incident 1',
                        description: 'Incident 1 description',
                        date: '2020-01-01',
                        editors: [],
                        reports: [],
                        'Alleged deployer of AI system': [],
                        'Alleged developer of AI system': [],
                        'Alleged harmed or nearly harmed parties': [],
                    },
                ],
            },
        });

        await seedCollection({ database: API_USAGE_DB, name: API_USAGE_COLLECTION, docs: [] });
    };

    const probe = (operationName = 'UsageProbe') => ({
        query: `query ${operationName} { incidents { incident_id } }`,
    });

    it('records a served request against the account, bucketed by UTC day', async () => {
        await seedAll();

        mockSession('counted1');

        await makeRequest(url, probe());

        const record = await usage().findOne({ userId: 'counted1' });

        expect(record).toMatchObject({
            userId: 'counted1',
            date: utcDayKey(new Date()),
            count: 1,
            operations: { UsageProbe: 1 },
        });

        expect(record!.firstRequestAt).toBeInstanceOf(Date);
        expect(record!.lastRequestAt).toBeInstanceOf(Date);
    });

    it('accumulates into one document per account per day, per operation name', async () => {
        await seedAll();

        mockSession('counted1');

        await makeRequest(url, probe('First'));
        await makeRequest(url, probe('First'));
        await makeRequest(url, probe('Second'));

        const records = await usage().find({ userId: 'counted1' }).toArray();

        expect(records).toHaveLength(1);

        expect(records[0]).toMatchObject({
            count: 3,
            operations: { First: 2, Second: 1 },
        });
    });

    it('does not record requests with no session, which have no account to attribute', async () => {
        await seedAll();

        mockAnonymousSession();

        await makeRequest(url, probe());

        expect(await usage().countDocuments()).toBe(0);
    });

    it('counts a blocked account\'s refused attempts separately from served requests', async () => {
        await seedAll();

        await getCollection('customData', 'users').updateOne(
            { userId: 'blocked1' },
            { $set: { api_access_blocked: true } }
        );

        clearApiAccessCache();

        mockSession('blocked1');

        await makeRequest(url, probe());

        const record = await usage().findOne({ userId: 'blocked1' });

        // A refusal is evidence of behaviour but was never served, so it must not
        // appear as billable usage.
        expect(record).toMatchObject({ deniedCount: 1 });

        expect(record!.count).toBeUndefined();
    });

    it('flags a served request whose response carried an error', async () => {
        await seedAll();

        mockSession('counted1');

        // `notifications` is admin-only, so this is a request that is attributed and
        // served but answered with an authorization error.
        await makeRequest(url, {
            query: `query ErroringProbe { notifications { _id } }`,
        });

        expect(await usage().findOne({ userId: 'counted1' })).toMatchObject({
            count: 1,
            errorCount: 1,
        });
    });

    describe('apiUsageSummaries', () => {
        const summariesQuery = (variables: Record<string, unknown> = {}) => ({
            query: `query SummariesProbe($userId: String, $from: String, $to: String) {
                apiUsageSummaries(userId: $userId, from: $from, to: $to) {
                    userId
                    count
                    errorCount
                    deniedCount
                    activeDays
                }
            }`,
            variables,
        });

        const seedUsageDocs = () =>
            seedCollection({
                database: API_USAGE_DB,
                name: API_USAGE_COLLECTION,
                docs: [
                    { userId: 'counted1', date: '2026-07-01', count: 10, errorCount: 1, deniedCount: 0 },
                    { userId: 'counted1', date: '2026-07-02', count: 5, errorCount: 0, deniedCount: 2 },
                    { userId: 'other1', date: '2026-07-02', count: 100, errorCount: 0, deniedCount: 0 },
                ],
            });

        it('totals a single account across days', async () => {
            await seedAll();
            await seedUsageDocs();

            mockSession('admin1');

            const response = await makeRequest(url, summariesQuery({ userId: 'counted1' }));

            expect(response.body.errors).toBeUndefined();

            expect(response.body.data.apiUsageSummaries).toMatchObject([
                { userId: 'counted1', count: 15, errorCount: 1, deniedCount: 2, activeDays: 2 },
            ]);
        });

        it('restricts a date range by UTC day key', async () => {
            await seedAll();
            await seedUsageDocs();

            mockSession('admin1');

            const response = await makeRequest(
                url,
                summariesQuery({ userId: 'counted1', from: '2026-07-02', to: '2026-07-02' })
            );

            expect(response.body.data.apiUsageSummaries).toMatchObject([
                { userId: 'counted1', count: 5, activeDays: 1 },
            ]);
        });

        it('ranks accounts by volume when no account is named', async () => {
            await seedAll();
            await seedUsageDocs();

            mockSession('admin1');

            const response = await makeRequest(url, summariesQuery());

            const summaries = response.body.data.apiUsageSummaries;

            // The heaviest consumer first, which is the order an admin looking for
            // abuse wants.
            expect(summaries[0]).toMatchObject({ userId: 'other1', count: 100 });
        });

        it('is refused for a non-admin, so one account cannot read another\'s volume', async () => {
            await seedAll();
            await seedUsageDocs();

            mockSession('counted1');

            const response = await makeRequest(url, summariesQuery({ userId: 'other1' }));

            expect(response.body.errors[0].message).toBe('not authorized');
        });

        it('is refused for the generated apiUsages query too', async () => {
            await seedAll();
            await seedUsageDocs();

            mockSession('counted1');

            const response = await makeRequest(url, {
                query: `query UsagesProbe { apiUsages { userId count } }`,
            });

            expect(response.body.errors[0].message).toBe('not authorized');
        });
    });

    describe('sanitizeOperationName', () => {
        it('keeps a valid GraphQL operation name', () => {
            expect(sanitizeOperationName('FindIncidents')).toBe('FindIncidents');
        });

        it('labels an unnamed operation', () => {
            expect(sanitizeOperationName(undefined)).toBe('anonymous');
            expect(sanitizeOperationName(null)).toBe('anonymous');
            expect(sanitizeOperationName('')).toBe('anonymous');
        });

        it('collapses names Mongo could not use as field keys, rather than writing them', () => {
            // `.` and a leading `$` are the two shapes Mongo rejects, and the name
            // arrives from the request body, so it cannot be trusted.
            expect(sanitizeOperationName('a.b')).toBe('other');
            expect(sanitizeOperationName('$set')).toBe('other');
            expect(sanitizeOperationName('x'.repeat(200))).toBe('other');
        });
    });
});
