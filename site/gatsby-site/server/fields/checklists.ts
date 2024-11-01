import { GraphQLFieldConfigMap } from "graphql";
import { allow } from "graphql-shield";
import { generateQueryFields } from "../utils";
import { ChecklistType } from "../types/checklist";


export const queryFields: GraphQLFieldConfigMap<any, any> = {

    ...generateQueryFields({ collectionName: 'checklists', Type: ChecklistType })
}


export const permissions = {
    Query: {
        checklist: allow,
        checklists: allow,
    }
}


