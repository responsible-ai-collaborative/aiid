import { MongoClient } from "mongodb";
import { generateApiToken } from '../server/apiTokens';

const config = require('../config');

/**
 * API tokens for every account (#4070).
 *
 * - A unique index on `customData.users.api_token`, partial so that accounts
 *   without a token (none, after this migration) do not collide on `null`.
 *   It serves the lookup on every token-authenticated request.
 * - A token for every account that has none, so the account page can always
 *   show one. New accounts get theirs on creation (SEE: nextauth.config.ts).
 *
 * Idempotent: accounts that already have a token are left alone.
 */
export const backfillApiTokens = async (client: MongoClient) => {

    const users = client.db(config.realm.production_db.db_custom_data).collection('users');

    await users.createIndex(
        { api_token: 1 },
        {
            name: 'users_api_token_unique',
            unique: true,
            partialFilterExpression: { api_token: { $type: 'string' } },
            background: true,
        }
    );

    const cursor = users.find({ api_token: { $not: { $type: 'string' } } }, { projection: { userId: 1 } });

    let generated = 0;

    for await (const user of cursor) {

        await users.updateOne({ _id: user._id }, { $set: { api_token: generateApiToken() } });

        generated++;
    }

    console.log(`API tokens: generated ${generated}`);

    return { generated };
};

export const up = async ({ context: { client } }: { context: { client: MongoClient } }) => {

    await backfillApiTokens(client);
};

export const down = async ({ context: { client } }: { context: { client: MongoClient } }) => {

    const users = client.db(config.realm.production_db.db_custom_data).collection('users');

    await users.dropIndex('users_api_token_unique');
    await users.updateMany({}, { $unset: { api_token: '', api_token_request_count: '', api_token_last_used_at: '', api_token_regenerated_at: '' } });
};
