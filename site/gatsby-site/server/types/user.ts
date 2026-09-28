import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GraphQLDateTime } from "graphql-scalars";
import { ObjectIdScalar } from "../scalars";
import { getQueryResolver } from "../utils";
import { Context } from "../interfaces";
import { UserCacheManager, UserAdminData } from "../fields/userCacheManager";

const UserAdminDatumType = new GraphQLObjectType({
    name: 'UserAdminDatum',
    fields: {
        creationDate: { type: new GraphQLNonNull(GraphQLDateTime) },
        disabled: { type: new GraphQLNonNull(GraphQLBoolean) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        lastAuthenticationDate: { type: GraphQLDateTime },
    },
});

const userCacheManager = new UserCacheManager();

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        _id: { type: ObjectIdScalar },
        adminData: {
            type: UserAdminDatumType,
            resolve: getQueryResolver(UserAdminDatumType, async (filter, projection, options, source: any, args, context: Context) => {

                const { user } = context;

                // Null, not `{}`, when there is nothing to show: `email` is non-nullable,
                // so an empty object made GraphQL raise an error for the row, and one
                // account without an auth record (anonymised on staging, or deleted) put
                // an error into the admin page's single list response and blanked the
                // whole table.
                let response: UserAdminData | null = null;

                // `user` is null for anonymous callers. The `notQueriesAdminData` shield
                // rule only inspects direct field selections, so a query that reaches
                // `adminData` through a fragment spread gets here unauthenticated —
                // dereferencing `user!` threw a TypeError instead of returning nothing.
                if (user && (user.id === source.userId || user.roles.includes('admin'))) {

                    response = await userCacheManager.getUserAdminData(source.userId, context) ?? null;
                }

                return response;
            }),
        },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        roles: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        userId: { type: new GraphQLNonNull(GraphQLString) },

        /**
         * Blocks this account from the GraphQL API. Enforced by the access gate
         * in `server/apiAccess.ts`; only an admin may change it, which is
         * enforced by `canEditProtectedUserFields` in `server/rules.ts` because
         * the `updateOneUser` mutation is otherwise open to a user editing their
         * own record.
         */
        api_access_blocked: { type: GraphQLBoolean },
        api_access_blocked_at: { type: GraphQLDateTime },
        api_access_blocked_reason: { type: GraphQLString },

        /**
         * The account's API token and its usage (#4070). Only issued by the
         * `regenerateApiToken` mutation, never through `updateOneUser`
         * (`canEditProtectedUserFields`); readable by the account itself alone
         * (`api_token`) or by it and admins (the counters), through
         * `server/userFieldVisibility.ts`. SEE: server/apiTokens.ts
         */
        api_token: { type: GraphQLString },
        api_token_request_count: { type: GraphQLInt },
        api_token_last_used_at: { type: GraphQLDateTime },
        api_token_regenerated_at: { type: GraphQLDateTime },
    },
});

//@ts-ignore 
UserType.getFields().adminData.dependencies = [];