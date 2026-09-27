import { GraphQLFieldConfigMap } from "graphql";
import { generateMutationFields, generateQueryFields } from "../utils";
import { Context } from "../interfaces";
import { notQueriesAdminData, isRole, isSelf, canEditProtectedUserFields, notFiltersByApiAccessFields } from "../rules";
import { UserType } from "../types/user";
import { and, or } from "graphql-shield";

export const queryFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateQueryFields({ databaseName: 'customData', collectionName: 'users', Type: UserType })
}


export const mutationFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateMutationFields({ databaseName: 'customData', collectionName: 'users', Type: UserType, generateFields: ['updateOne'] }),
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
    },
}