import { GraphQLFieldConfigMap } from "graphql";
import { allow } from "graphql-shield";
import { generateQueryFields } from "../utils";
import { IncidentHistoryType } from "../types/incidentHistory";


export const queryFields: GraphQLFieldConfigMap<any, any> = {

    ...generateQueryFields({ databaseName: 'history', collectionName: 'incidents', fieldName: 'history_incident', Type: IncidentHistoryType })
}

export const permissions = {
    Query: {
        history_incident: allow,
        history_incidents: allow,
    }
}