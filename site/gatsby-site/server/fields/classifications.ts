import { GraphQLFieldConfigMap } from "graphql";
import { allow } from "graphql-shield";
import { generateMutationFields, generateQueryFields } from "../utils";
import { ClassificationType } from "../types/classification";


export const queryFields: GraphQLFieldConfigMap<any, any> = {

    ...generateQueryFields({ collectionName: 'classifications', Type: ClassificationType })
}


export const mutationFields: GraphQLFieldConfigMap<any, any> = {

    ...generateMutationFields({ collectionName: 'classifications', Type: ClassificationType, generateFields: ['upsertOne'] }),
}

export const permissions = {
    Query: {
        classification: allow,
        classifications: allow,
    },
    Mutation: {
        upsertOneClassification: allow,
    }
}