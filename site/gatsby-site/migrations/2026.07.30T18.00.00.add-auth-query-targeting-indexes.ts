import { MongoClient } from "mongodb";

const config = require('../config');

/**
 * Indexes the auth-path collections, the remaining source of the
 * "Query Targeting: Scanned Objects / Returned has gone above 1000" alert
 * (2026-07-30, ratio 246:1) after the 2026.05.26 and 2026.07.25 rounds.
 *
 * None of the `auth` database collections (written by the NextAuth adapter
 * in server/MongoDBAdapter.ts) nor `customData.users` has ever had an index
 * beyond `_id`, and they sit on the hottest path in the API: every GraphQL
 * request runs `context()` -> `getServerSession`, which does
 *
 *   auth.sessions      { sessionToken: S }          <- getSessionAndUser, once per request
 *   customData.users   { userId: U }                <- nextauth session callback, once per request
 *
 * so every authenticated request COLLSCANs both collections to return one
 * document each. The lower-frequency auth queries COLLSCAN too:
 *
 *   auth.users               { email: E }                 <- every login / magic-link send (twice)
 *   auth.accounts            { provider, providerAccountId } <- getUserByAccount
 *   auth.verification_tokens { identifier, token }        <- magic-link consumption
 *   auth.sessions            { userId: U }                <- deleteUser cleanup
 *
 * The TTL indexes also fix unbounded growth: NextAuth only deletes an
 * expired session or verification token when that exact token is presented
 * again, so abandoned rows accumulate forever and make every scan worse.
 * TTL-purging rows past their `expires` date matches NextAuth semantics —
 * it already treats them as invalid.
 *
 * Indexes are non-unique so the migration cannot fail on pre-existing
 * duplicates; the adapter does not rely on index-enforced uniqueness.
 */
export const up = async ({ context: { client } }: { context: { client: MongoClient } }) => {

  const authDb = client.db(config.realm.production_db.db_auth);
  const customDataDb = client.db(config.realm.production_db.db_custom_data);

  // Once per authenticated request.
  await authDb.collection('sessions').createIndex(
    { sessionToken: 1 },
    { name: 'sessionToken_idx', background: true },
  );

  // deleteUser fans out a deleteMany({ userId }).
  await authDb.collection('sessions').createIndex(
    { userId: 1 },
    { name: 'userId_idx', background: true },
  );

  // Auto-purge sessions past their 5-day expiry.
  await authDb.collection('sessions').createIndex(
    { expires: 1 },
    { name: 'expires_ttl_idx', expireAfterSeconds: 0, background: true },
  );

  // Every login and magic-link send resolves the user by email.
  await authDb.collection('users').createIndex(
    { email: 1 },
    { name: 'email_idx', background: true },
  );

  // getUserByAccount / unlinkAccount lookup key.
  await authDb.collection('accounts').createIndex(
    { provider: 1, providerAccountId: 1 },
    { name: 'provider_providerAccountId_idx', background: true },
  );
  await authDb.collection('accounts').createIndex(
    { userId: 1 },
    { name: 'userId_idx', background: true },
  );

  // Magic-link consumption does findOneAndDelete({ identifier, token }).
  await authDb.collection('verification_tokens').createIndex(
    { identifier: 1, token: 1 },
    { name: 'identifier_token_idx', background: true },
  );

  // Auto-purge verification tokens past their 24-hour expiry.
  await authDb.collection('verification_tokens').createIndex(
    { expires: 1 },
    { name: 'expires_ttl_idx', expireAfterSeconds: 0, background: true },
  );

  // Session callback and the isSelf graphql-shield rule filter by userId.
  await customDataDb.collection('users').createIndex(
    { userId: 1 },
    { name: 'userId_idx', background: true },
  );

  console.log('Created query-targeting indexes on the auth collections');
};

export const down = async ({ context: { client } }: { context: { client: MongoClient } }) => {

  const authDb = client.db(config.realm.production_db.db_auth);
  const customDataDb = client.db(config.realm.production_db.db_custom_data);

  const drops: Array<[ReturnType<typeof authDb.collection>, string]> = [
    [authDb.collection('sessions'), 'sessionToken_idx'],
    [authDb.collection('sessions'), 'userId_idx'],
    [authDb.collection('sessions'), 'expires_ttl_idx'],
    [authDb.collection('users'), 'email_idx'],
    [authDb.collection('accounts'), 'provider_providerAccountId_idx'],
    [authDb.collection('accounts'), 'userId_idx'],
    [authDb.collection('verification_tokens'), 'identifier_token_idx'],
    [authDb.collection('verification_tokens'), 'expires_ttl_idx'],
    [customDataDb.collection('users'), 'userId_idx'],
  ];

  for (const [collection, indexName] of drops) {
    try {
      await collection.dropIndex(indexName);
    } catch (e: any) {
      console.log(`Could not drop ${indexName}: ${e.message}`);
    }
  }
};
