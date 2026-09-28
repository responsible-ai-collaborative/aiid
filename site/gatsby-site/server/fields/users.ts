import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLString } from "graphql";
import { rule } from "graphql-shield";
import { regenerateUserApiToken } from "../apiTokens";
import { generateMutationFields, generateQueryFields } from "../utils";
import { Context } from "../interfaces";
import { notQueriesAdminData, isRole, isSelf, canEditProtectedUserFields, notFiltersByApiAccessFields } from "../rules";
import { UserType } from "../types/user";
import { and, or } from "graphql-shield";

export const queryFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateQueryFields({ databaseName: 'customData', collectionName: 'users', Type: UserType })
}


/**
 * The account whose token a `regenerateApiToken` call is about: the caller's own
 * unless an admin names another. Anyone may replace their own token; an admin may
 * replace (that is, revoke) anyone's, without ever seeing it.
 */
const canRegenerateApiToken = () => rule()(
    async (parent, args: { userId?: string }, context: Context) => {

        const { user } = context;

        if (!user) {
            return new Error('not authorized');
        }

        if (!args.userId || args.userId === user.id || user.roles.includes('admin')) {
            return true;
        }

        return new Error('not authorized');
    },
)

export const mutationFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateMutationFields({ databaseName: 'customData', collectionName: 'users', Type: UserType, generateFields: ['updateOne'] }),

    /**
     * Issues a fresh API token for an account, invalidating the previous one at
     * once (#4070). Returns the account; the new token is readable in the result
     * by the account itself, and redacted for an admin acting on another account.
     * SEE: server/apiTokens.ts
     */
    regenerateApiToken: {
        type: new GraphQLNonNull(UserType),
        args: {
            userId: { type: GraphQLString },
        },
        resolve: async (_source, args: { userId?: string }, context: Context) => {

            const userId = args.userId ?? context.user!.id;

            await regenerateUserApiToken(context.client, userId);

            return context.client.db('customData').collection('users').findOne({ userId });
        },
    },
}

export const permissions = {
    Query: {
        // The API-block fields are admin-or-self only. Their values are withheld
        // by the field resolvers (SEE: server/types/user.ts); the rule keeps a
        // non-admin from learning them through `filter` or `sort` instead.
        user: or(isSelf(), and(notQueriesAdminData(), notFiltersByApiAccessFields())),
        users: or(isRole('admin'), and(notQueriesAdminData(), notFiltersByApiAccessFields())),
    },
    Mutation: {
        // `isSelf()` also passes for admins, and permits a user to edit their own
        // record. `canEditProtectedUserFields()` narrows that for the fields no
        // account may set on itself — `roles` and the API-access flags — and is
        // transparent for ordinary profile edits. SEE: server/rules.ts
        updateOneUser: and(isSelf(), canEditProtectedUserFields()),
        regenerateApiToken: canRegenerateApiToken(),
    },
}