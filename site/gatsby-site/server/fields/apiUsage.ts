import { GraphQLFieldConfigMap, GraphQLList, GraphQLString } from "graphql";
import { generateQueryFields } from "../utils";
import { Context } from "../interfaces";
import { isRole } from "../rules";
import { ApiUsageSummaryType, ApiUsageType } from "../types/apiUsage";
import { API_USAGE_COLLECTION, API_USAGE_DB } from "../apiUsage";

/**
 * Read access to the per-account API usage counters.
 *
 * Admin-only. Usage is the raw material for both of the things this feature
 * exists to enable — identifying an account whose request volume is automated
 * rather than human, and billing an organisation for its consumption — and
 * neither should be visible to the account being measured, nor should one
 * customer be able to read another's volume.
 */
export const queryFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateQueryFields({
        databaseName: API_USAGE_DB,
        collectionName: API_USAGE_COLLECTION,
        Type: ApiUsageType,
        fieldName: 'apiUsage',
    }),

    /**
     * Totals per account over an optional date range, so a caller does not have
     * to page through one document per account per day to answer "how much did
     * this account use". `from`/`to` are inclusive `YYYY-MM-DD` UTC day keys,
     * matching the `date` field of the underlying documents.
     */
    apiUsageSummaries: {
        type: new GraphQLList(ApiUsageSummaryType),
        args: {
            userId: { type: GraphQLString },
            from: { type: GraphQLString },
            to: { type: GraphQLString },
        },
        resolve: async (_source, args: { userId?: string, from?: string, to?: string }, context: Context) => {

            const match: Record<string, unknown> = {};

            if (args.userId) {

                match.userId = args.userId;
            }

            if (args.from || args.to) {

                match.date = {
                    ...(args.from ? { $gte: args.from } : {}),
                    ...(args.to ? { $lte: args.to } : {}),
                };
            }

            const results = await context.client
                .db(API_USAGE_DB)
                .collection(API_USAGE_COLLECTION)
                .aggregate([
                    ...(Object.keys(match).length ? [{ $match: match }] : []),
                    {
                        $group: {
                            _id: '$userId',
                            // The counters are only created by `$inc`, but a
                            // document written before a counter existed will be
                            // missing it, so each is coalesced to 0.
                            count: { $sum: { $ifNull: ['$count', 0] } },
                            errorCount: { $sum: { $ifNull: ['$errorCount', 0] } },
                            deniedCount: { $sum: { $ifNull: ['$deniedCount', 0] } },
                            activeDays: { $sum: 1 },
                            firstRequestAt: { $min: '$firstRequestAt' },
                            lastRequestAt: { $max: '$lastRequestAt' },
                        },
                    },
                    { $sort: { count: -1 } },
                ])
                .toArray();

            return results.map(({ _id, ...totals }) => ({ userId: _id, ...totals }));
        },
    },
}

export const permissions = {
    Query: {
        apiUsage: isRole('admin'),
        apiUsages: isRole('admin'),
        apiUsageSummaries: isRole('admin'),
    },
}
