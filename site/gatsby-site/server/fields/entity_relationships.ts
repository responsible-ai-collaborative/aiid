import { GraphQLFieldConfigMap, GraphQLObjectType } from "graphql";
import { allow } from "graphql-shield";
import { isRole } from "../rules";
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
        // Entity relationships are shared editorial data; only editors may change them.
        updateOneEntity_relationship: isRole('incident_editor'),
        upsertOneEntity_relationship: isRole('incident_editor'),
        deleteOneEntity_relationship: isRole('incident_editor'),
    }
}