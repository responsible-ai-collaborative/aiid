import { GraphQLFieldConfigMap } from "graphql";
import { allow } from "graphql-shield";
import { generateMutationFields, generateQueryFields } from "../utils";
import { ClassificationType } from "../types/classification";
import { isRole } from "../rules";


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
        upsertOneClassification: isRole('incident_editor'),
    }
}