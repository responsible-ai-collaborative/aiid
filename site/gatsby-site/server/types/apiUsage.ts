import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GraphQLDateTime } from "graphql-scalars";
import { ObjectIdScalar } from "../scalars";

/**
 * One account's API request counts for one UTC day.
 * SEE: server/apiUsage.ts for how these are written.
 *
 * The per-operation breakdown that `recordApiRequest` also stores is
 * deliberately not exposed here: its keys are operation names, so it has no
 * fixed shape to describe in the schema, and the generated filter/sort machinery
 * these fields rely on cannot work with an open map. It remains available in
 * Mongo for ad-hoc analysis.
 */
export const ApiUsageType = new GraphQLObjectType({
    name: 'ApiUsage',
    fields: {
        _id: { type: ObjectIdScalar },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        /** UTC day bucket, `YYYY-MM-DD`. */
        date: { type: new GraphQLNonNull(GraphQLString) },
        /** Requests served for this account. */
        count: { type: GraphQLInt },
        /** Served requests whose response carried at least one GraphQL error. */
        errorCount: { type: GraphQLInt },
        /** Requests refused because the account is blocked from the API. */
        deniedCount: { type: GraphQLInt },
        firstRequestAt: { type: GraphQLDateTime },
        lastRequestAt: { type: GraphQLDateTime },
    },
});

/** Totals for one account across a date range. */
export const ApiUsageSummaryType = new GraphQLObjectType({
    name: 'ApiUsageSummary',
    fields: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        count: { type: new GraphQLNonNull(GraphQLInt) },
        errorCount: { type: new GraphQLNonNull(GraphQLInt) },
        deniedCount: { type: new GraphQLNonNull(GraphQLInt) },
        /** Number of distinct UTC days on which the account called the API. */
        activeDays: { type: new GraphQLNonNull(GraphQLInt) },
        firstRequestAt: { type: GraphQLDateTime },
        lastRequestAt: { type: GraphQLDateTime },
    },
});
