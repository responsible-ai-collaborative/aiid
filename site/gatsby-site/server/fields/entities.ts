import { GraphQLFieldConfigMap } from "graphql";
import { allow } from "graphql-shield";
import { generateMutationFields, generateQueryFields } from "../utils";
import { Context } from "../interfaces";
import { EntityType } from "../types/entity";


export const queryFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateQueryFields({ collectionName: 'entities', Type: EntityType })
}


export const mutationFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateMutationFields({ collectionName: 'entities', Type: EntityType, generateFields: ['updateOne', 'upsertOne'] }),
}

export const permissions = {
    Query: {
        entity: allow,
        entities: allow,
    },
    Mutation: {
        updateOneEntity: allow,
        upsertOneEntity: allow,
    }
}