import { GraphQLFieldConfigMap } from "graphql";
import { allow } from "graphql-shield";
import { generateQueryFields } from "../utils";
import { EntityDuplicateType } from "../types/entityDuplicate";

export const queryFields: GraphQLFieldConfigMap<any, any> = {
    ...generateQueryFields({ collectionName: 'entity_duplicates', Type: EntityDuplicateType, fieldName: 'entityDuplicate' })
}

export const permissions = {
    Query: {
        entityDuplicate: allow,
        entityDuplicates: allow,
    }
}