import { ApolloServerPlugin, BaseContext } from '@apollo/server';
import { GraphQLError } from 'graphql';
import { MongoClient } from 'mongodb';
import { API_ACCESS_BLOCKED, API_LOGIN_REQUIRED } from './apiAccess';
import { Context } from './interfaces';

/**
 * Per-account API usage accounting.
 *
 * Now that every API request carries a user identity (see `server/apiAccess.ts`)
 * the requests can be counted per account. Two things depend on that count:
 * spotting an account whose volume looks automated rather than human, and being
 * able to tell an organisation how much of the API it consumed without having to
 * publish that figure.
 *
 * Counts are kept as one document per (account, UTC day) rather than one
 * document per request. A request log would grow without bound — the traffic
 * this change exists to measure is exactly the traffic that would make it
 * expensive — whereas a day bucket is a single indexed upsert per request and
 * stays proportional to (accounts x days). Day granularity is enough for both
 * uses above; per-request forensics remain available in Sentry, which the
 * GraphQL lambda already annotates with the user id.
 */

export const API_USAGE_DB = 'customData';
export const API_USAGE_COLLECTION = 'api_usage';

export interface ApiUsageRecord {
    userId: string;
    /** UTC day bucket, `YYYY-MM-DD`. */
    date: string;
    /** Requests accepted by the access gate. */
    count: number;
    /** Accepted requests whose response carried at least one GraphQL error. */
    errorCount: number;
    /** Requests rejected by the access gate (blocked account). */
    deniedCount: number;
    /** Per-operation-name breakdown of `count`. */
    operations: Record<string, number>;
    firstRequestAt: Date;
    lastRequestAt: Date;
}

export const utcDayKey = (date: Date) => date.toISOString().slice(0, 10);

/**
 * Mongo rejects field names containing `.` or a leading `$`. GraphQL operation
 * names cannot contain either, but the name arrives from the request body and so
 * is attacker-controlled: an unnamed or hand-rolled request could carry
 * anything. Anything unexpected collapses to a single bucket rather than
 * throwing (or, worse, letting a caller write arbitrary keys into the document).
 */
export const OPERATION_NAME_PATTERN = /^[_A-Za-z][_0-9A-Za-z]{0,63}$/;

export const sanitizeOperationName = (operationName?: string | null) => {

    if (!operationName) {

        return 'anonymous';
    }

    return OPERATION_NAME_PATTERN.test(operationName) ? operationName : 'other';
}

export const getApiUsageCollection = (client: MongoClient) =>
    client.db(API_USAGE_DB).collection<ApiUsageRecord>(API_USAGE_COLLECTION);

/**
 * Records a single request against an account's day bucket.
 *
 * `denied` requests are counted separately and do not contribute to `count`:
 * a blocked account's retries are evidence of behaviour, but they were never
 * served and should not appear as usage on an invoice.
 */
export const recordApiRequest = async ({
    client,
    userId,
    operationName,
    hasErrors = false,
    denied = false,
    now = new Date(),
}: {
    client: MongoClient;
    userId: string;
    operationName?: string | null;
    hasErrors?: boolean;
    denied?: boolean;
    now?: Date;
}) => {

    const date = utcDayKey(now);

    const increments: Record<string, number> = denied
        ? { deniedCount: 1 }
        : { count: 1, [`operations.${sanitizeOperationName(operationName)}`]: 1 };

    if (hasErrors && !denied) {

        increments.errorCount = 1;
    }

    await getApiUsageCollection(client).updateOne(
        { userId, date },
        {
            $inc: increments,
            $setOnInsert: { userId, date, firstRequestAt: now },
            $set: { lastRequestAt: now },
        },
        { upsert: true }
    );
}

const isAccessDenial = (error: GraphQLError) =>
    error.extensions?.code === API_LOGIN_REQUIRED || error.extensions?.code === API_ACCESS_BLOCKED;

/**
 * Apollo Server plugin that records each request against its account.
 *
 * Installed on both the Netlify lambda (`netlify/functions/graphql.ts`) and the
 * standalone server the Jest suite builds (`server/tests/utils.ts`), so the
 * behaviour under test is the behaviour in production.
 *
 * Requests with no session are not recorded: the gate has already refused them
 * and there is no account to attribute them to. Counting unattributable bot
 * traffic is what the origin/user-agent heuristics and Netlify's own analytics
 * are for.
 *
 * A failure to record is swallowed. Usage accounting is observability, and
 * losing a count is a far better outcome than failing a request that the API
 * has already successfully answered.
 *
 * Typed against `BaseContext` rather than `Context` so that installing it does not
 * pin the enclosing `ApolloServer`'s context generic. The Jest suite declares its
 * servers as plain `ApolloServer`, and a plugin typed on `Context` would widen that
 * inference and fail every spec at compile time. The context is read back as
 * `Context` below, which is safe because the only field touched is `user?.id` and
 * it is read defensively.
 */
export const apiUsagePlugin = (client: MongoClient): ApolloServerPlugin<BaseContext> => ({

    async requestDidStart() {

        let errors: readonly GraphQLError[] = [];

        return {

            async didEncounterErrors(requestContext) {

                errors = requestContext.errors ?? [];
            },

            async willSendResponse(requestContext) {

                const userId = (requestContext.contextValue as Partial<Context>)?.user?.id;

                if (!userId) {

                    return;
                }

                try {

                    await recordApiRequest({
                        client,
                        userId,
                        // `requestContext.operationName` is the name Apollo resolved
                        // from the parsed document; `request.operationName` is only
                        // what the caller happened to put in the request body.
                        // Preferring the resolved one means a named operation is
                        // attributed even when the client omits the field, which a
                        // hand-written or non-Apollo client often does.
                        operationName: requestContext.operationName ?? requestContext.request.operationName,
                        hasErrors: errors.length > 0,
                        denied: errors.some(isAccessDenial),
                    });
                }
                catch (e) {

                    console.error('Failed to record API usage', e as Error);
                }
            },
        };
    },
});
