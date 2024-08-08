import { GraphQLFieldConfigMap } from "graphql";
import { allow } from "graphql-shield";
import { generateQueryFields } from "../utils";
import { TaxaType } from "../types/taxa";


export const queryFields: GraphQLFieldConfigMap<any, any> = {

    ...generateQueryFields({ collectionName: 'taxa', Type: TaxaType })
}


export const permissions = {
    Query: {
        taxa: allow,
        taxas: allow,
    }
}