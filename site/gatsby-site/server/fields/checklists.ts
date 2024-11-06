import { GraphQLFieldConfigMap } from "graphql";
import { allow } from "graphql-shield";
import { generateMutationFields, generateQueryFields, getQueryResolver } from "../utils";
import { ChecklistType } from "../types/checklist";


export const queryFields: GraphQLFieldConfigMap<any, any> = {

    ...generateMutationFields({ collectionName: 'checklists', Type: ChecklistType, generateFields: ['updateOne', 'deleteOne', 'insertOne', 'upsertOne'] }),
    ...generateQueryFields({ collectionName: 'checklists', Type: ChecklistType })
}


export const permissions = {
    Query: {
        checklist: allow,
        checklists: allow,
    }
}


