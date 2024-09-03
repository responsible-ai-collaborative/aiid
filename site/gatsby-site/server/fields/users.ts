import { GraphQLFieldConfigMap } from "graphql";
import { generateMutationFields, generateQueryFields } from "../utils";
import { Context } from "../interfaces";
import { isRole, isSelf } from "../rules";
import { UserType } from "../types/user";

export const queryFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateQueryFields({ databaseName: 'customData', collectionName: 'users', Type: UserType })
}


export const mutationFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateMutationFields({ databaseName: 'customData', collectionName: 'users', Type: UserType, generateFields: ['updateOne'] }),
}

export const permissions = {
    Query: {
        user: isSelf(),
        users: isRole('incident_editor'), //TODO: this needs more work
    },
    Mutation: {
        updateOneUser: isSelf(),
    },
}