import { GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
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

                let response: UserAdminData = {}

                if (user!.id === source.userId || user!.roles.includes('admin')) {

                    response = await userCacheManager.getUserAdminData(source.userId, context) ?? {};
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
    },
});

//@ts-ignore 
UserType.getFields().adminData.dependencies = [];