import { GraphQLFieldConfigMap, GraphQLObjectType } from "graphql";
import { allow } from "graphql-shield";
import { generateMutationFields, generateQueryFields } from "../utils";
import { Context } from "../interfaces";
import { Entity_relationshipType } from "../types/entity_relationship";


export const queryFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateQueryFields({ collectionName: 'entitiy_relationships', Type: Entity_relationshipType })
}


export const mutationFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateMutationFields({ collectionName: 'entity_relationships', Type: Entity_relationshipType, generateFields: ['insertOne', 'updateOne', 'upsertOne'] }),
}

export const permissions = {
    Query: {
        entity_relationship: allow,
        entity_relationships: allow,
    },
    Mutation: {
        insertOneEntity_relationship: allow,
        updateOneEntity_relationship: allow,
        upsertOneEntity_relationship: allow,
    }
}