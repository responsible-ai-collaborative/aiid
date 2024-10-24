import { GraphQLFieldConfigMap } from "graphql";
import { generateMutationFields, generateQueryFields } from "../utils";
import { Context } from "../interfaces";
import { notQueriesAdminData, isRole, isSelf } from "../rules";
import { UserType } from "../types/user";
import { or } from "graphql-shield";

export const queryFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateQueryFields({ databaseName: 'customData', collectionName: 'users', Type: UserType })
}


export const mutationFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateMutationFields({ databaseName: 'customData', collectionName: 'users', Type: UserType, generateFields: ['updateOne'] }),
}

export const permissions = {
    Query: {
        user: or(isSelf(), notQueriesAdminData()),
        users: or(isRole('admin'), notQueriesAdminData()),
    },
    Mutation: {
        updateOneUser: isSelf(),
    },
}