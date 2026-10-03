import { MongoClient } from 'mongodb';
import { getClient, getCollection, seedFixture } from '../utils';
import { backfillApiTokens, up } from '../../../migrations/2026.09.28T12.00.00.add-api-tokens';
import { API_TOKEN_PATTERN } from '../../apiTokens';

describe('Migration: 2026.09.28T12.00.00.add-api-tokens', () => {

    let client: MongoClient;

    beforeAll(async () => {
        client = getClient();
    });

    beforeEach(async () => {
        await seedFixture({
            customData: {
                users: [
                    { userId: 'has-token', roles: ['admin'], api_token: 'aiid_' + 'k'.repeat(40) },
                    { userId: 'no-token', roles: ['subscriber'] },
                    { userId: 'null-token', roles: ['subscriber'], api_token: null },
                ],
            },
        });
    });

    test('issues a token to every account without one and indexes the field', async () => {

        const counts = await backfillApiTokens(client);

        expect(counts).toEqual({ generated: 2 });

        const users = await getCollection('customData', 'users').find({}).toArray();

        for (const user of users) {
            expect(user.api_token).toMatch(API_TOKEN_PATTERN);
        }

        expect(users.find((u) => u.userId === 'has-token')?.api_token).toBe('aiid_' + 'k'.repeat(40));

        const indexes = await getCollection('customData', 'users').indexes();

        const index = indexes.find((i) => i.name === 'users_api_token_unique');

        expect(index).toMatchObject({ unique: true, key: { api_token: 1 } });
    });

    test('is idempotent', async () => {

        await up({ context: { client } } as any);

        const before = (await getCollection('customData', 'users').find({}).toArray()).map((u) => [u.userId, u.api_token]);

        expect(await backfillApiTokens(client)).toEqual({ generated: 0 });

        const after = (await getCollection('customData', 'users').find({}).toArray()).map((u) => [u.userId, u.api_token]);

        expect(after).toEqual(before);
    });

    test('the index refuses a duplicate token', async () => {

        await up({ context: { client } } as any);

        await expect(
            getCollection('customData', 'users').updateOne({ userId: 'no-token' }, { $set: { api_token: 'aiid_' + 'k'.repeat(40) } })
        ).rejects.toMatchObject({ code: 11000 });
    });
});
