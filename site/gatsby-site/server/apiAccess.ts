import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { IMiddlewareFunction } from 'graphql-middleware';
import { MongoClient } from 'mongodb';
import { Context } from './interfaces';
import {
    API_ACCESS_BLOCKED,
    API_ACCESS_BLOCKED_MESSAGE,
    API_LOGIN_REQUIRED,
    API_LOGIN_REQUIRED_MESSAGE,
    ApiAccessDenialCode,
} from './apiAccessCodes';

/**
 * API access control.
 *
 * Historically every read field of the GraphQL API was `allow` (see the
 * `permissions` export of each module in `server/fields`), which meant the
 * endpoint at `/api/graphql` could be queried by anyone, including the large
 * volume of unattributable bot traffic that motivated the coarse
 * `API_VALIDATE_ORIGIN` / `API_VALIDATE_USER_AGENT` heuristics in
 * `netlify/functions/graphql.ts`.
 *
 * Those heuristics can only guess at who is calling. This module replaces the
 * guess with an identity: every root field of the API now requires an
 * authenticated session, so each request can be attributed to a user account,
 * counted (see `server/apiUsage.ts`) and, if the account turns out to be
 * abusive, blocked.
 *
 * The gate is installed as a `graphql-middleware` layer over the whole schema
 * in `server/local.ts` rather than by editing the per-module `permissions`
 * maps. Doing it in one place means:
 *
 *  - it cannot be forgotten when a new root field is added (default-secure),
 *  - it applies to every consumer of `schema.ts`, including the standalone
 *    Apollo server the Jest suite builds in `server/tests/utils.ts`, and
 *  - the existing role rules (`isRole`, `isSelf`, ...) keep expressing *what*
 *    a logged-in user may do, without also having to express *that* they must
 *    be logged in.
 */

export {
    API_LOGIN_REQUIRED,
    API_ACCESS_BLOCKED,
    API_LOGIN_REQUIRED_MESSAGE,
    API_ACCESS_BLOCKED_MESSAGE,
} from './apiAccessCodes';

export const USERS_DB = 'customData';
export const USERS_COLLECTION = 'users';

/**
 * Whether the login requirement is enforced.
 *
 * Enforced by default. `API_REQUIRE_LOGIN=false` disables it, which exists for
 * two reasons: it gives operators a way to roll the change back without a
 * redeploy, and it lets the parts of the test suite that predate the
 * requirement keep exercising anonymous reads.
 */
export const isApiLoginRequired = () => process.env.API_REQUIRE_LOGIN !== 'false';

export interface ApiAccessDenial {
    code: ApiAccessDenialCode;
    message: string;
    reason?: string;
}

/** Whether a GraphQL error's `extensions.code` is one of the gate's denials. */
export const isApiAccessDenialCode = (code: unknown): boolean =>
    code === API_LOGIN_REQUIRED || code === API_ACCESS_BLOCKED;

/**
 * Per-process cache of the blocked flag.
 *
 * The gate runs on every root field of every request, so reading the user
 * document from Mongo each time would add a round trip to each one. Netlify
 * reuses a warm lambda container across requests, so a short TTL keeps the
 * common case in memory while still letting a block take effect promptly.
 */
const BLOCK_CACHE_TTL_MS = 15 * 1000;

const blockCache = new Map<string, { checkedAt: number; blocked: boolean; reason?: string }>();

/** Exposed for tests, which need to observe a block immediately after writing it. */
export const clearApiAccessCache = () => blockCache.clear();

export const getApiAccessBlock = async (
    userId: string,
    client: MongoClient
): Promise<{ blocked: boolean; reason?: string }> => {

    const cached = blockCache.get(userId);

    if (cached && Date.now() - cached.checkedAt < BLOCK_CACHE_TTL_MS) {

        return { blocked: cached.blocked, reason: cached.reason };
    }

    const user = await client
        .db(USERS_DB)
        .collection(USERS_COLLECTION)
        .findOne<{ api_access_blocked?: boolean; api_access_blocked_reason?: string }>(
            { userId },
            { projection: { api_access_blocked: 1, api_access_blocked_reason: 1 } }
        );

    const result = {
        blocked: Boolean(user?.api_access_blocked),
        reason: user?.api_access_blocked_reason ?? undefined,
    };

    blockCache.set(userId, { ...result, checkedAt: Date.now() });

    return result;
}

/**
 * Resolves whether the caller may use the API, returning `null` when they may and
 * a denial when they may not.
 *
 * Kept separate from the gate below, which throws, so the same decision can be
 * inspected without handling an exception — the shape a caller wants when it is
 * deciding what to render rather than whether to serve.
 */
export const checkApiAccess = async (context: Pick<Context, 'user' | 'client'>): Promise<ApiAccessDenial | null> => {

    if (!isApiLoginRequired()) {

        return null;
    }

    const { user, client } = context;

    if (!user) {

        return { code: API_LOGIN_REQUIRED, message: API_LOGIN_REQUIRED_MESSAGE };
    }

    const { blocked, reason } = await getApiAccessBlock(user.id, client);

    if (blocked) {

        return { code: API_ACCESS_BLOCKED, message: API_ACCESS_BLOCKED_MESSAGE, reason };
    }

    return null;
}

export const apiAccessError = (denial: ApiAccessDenial) => new GraphQLError(denial.message, {
    extensions: {
        code: denial.code,
        // `http` is read by Apollo Server to set the response status, so an
        // unauthenticated caller sees a 401 rather than a 200 carrying an error.
        http: { status: denial.code === API_LOGIN_REQUIRED ? 401 : 403 },
        ...(denial.reason ? { reason: denial.reason } : {}),
    },
});

/**
 * `graphql-middleware` gate applied to every field of Query and Mutation.
 *
 * Introspection meta-fields (`__schema`, `__type`) are not part of the Query
 * type's field map, so they are deliberately left reachable: the schema shape
 * carries no incident data and keeping it public means the Apollo Explorer at
 * `/api/graphql` still loads for a logged-out visitor.
 */
const gate: IMiddlewareFunction<any, Context> = async (
    resolve,
    parent,
    args,
    context: Context,
    info: GraphQLResolveInfo
) => {

    const denial = await checkApiAccess(context);

    if (denial) {

        throw apiAccessError(denial);
    }

    return resolve(parent, args, context, info);
}

export const apiAccessMiddleware = {
    Query: gate,
    Mutation: gate,
};
