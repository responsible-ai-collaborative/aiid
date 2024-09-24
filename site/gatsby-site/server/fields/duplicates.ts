import { GraphQLFieldConfigMap } from "graphql";
import { allow } from "graphql-shield";
import { generateMutationFields, generateQueryFields } from "../utils";
import { DuplicateType } from "../types/duplicate";
import { isRole } from "../rules";


export const queryFields: GraphQLFieldConfigMap<any, any> = {

    ...generateQueryFields({ collectionName: 'duplicates', Type: DuplicateType })
}


export const mutationFields: GraphQLFieldConfigMap<any, any> = {

    ...generateMutationFields({ collectionName: 'duplicates', Type: DuplicateType }),
}


export const permissions = {
    Query: {
        duplicate: allow,
        duplicates: allow,
    },
    Mutation: {
        insertOneDuplicate: isRole('incident_editor'),
    },
}