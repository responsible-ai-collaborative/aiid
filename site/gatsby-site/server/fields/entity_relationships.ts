import { GraphQLFieldConfigMap, GraphQLObjectType } from "graphql";
import { allow } from "graphql-shield";
import { generateMutationFields, generateQueryFields } from "../utils";
import { Context } from "../interfaces";
import { Entity_relationshipType } from "../types/entity_relationship";


export const queryFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateQueryFields({ collectionName: 'entity_relationships', Type: Entity_relationshipType })
}


export const mutationFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateMutationFields({ collectionName: 'entity_relationships', Type: Entity_relationshipType, generateFields: ['updateOne', 'upsertOne', 'deleteOne'] }),
}

export const permissions = {
    Query: {
        entity_relationships: allow,
    },
    Mutation: {
        updateOneEntity_relationship: allow,
        upsertOneEntity_relationship: allow,
        deleteOneEntity_relationship: allow,
    }
}