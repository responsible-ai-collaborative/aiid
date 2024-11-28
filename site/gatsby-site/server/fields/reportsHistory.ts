import { GraphQLFieldConfigMap } from "graphql";
import { allow } from "graphql-shield";
import { generateQueryFields } from "../utils";
import { ReportHistoryType } from "../types/reportHistory";


export const queryFields: GraphQLFieldConfigMap<any, any> = {

    ...generateQueryFields({ databaseName: 'history', collectionName: 'reports', fieldName: 'history_report', Type: ReportHistoryType })
}

export const permissions = {
    Query: {
        history_report: allow,
        history_reports: allow,
    }
}