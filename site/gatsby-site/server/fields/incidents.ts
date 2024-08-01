import { GraphQLFieldConfigMap, GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { allow } from "graphql-shield";
import { generateMutationFields, generateQueryFields, getListRelationshipConfig, getListRelationshipExtension, getListRelationshipResolver, getQueryResolver } from "../utils";
import { Context } from "../interfaces";
import { ObjectIdScalar } from "../scalars";
import { isRole } from "../rules";
import { NlpSimilarIncidentType } from "../types";
import { linkReportsToIncidents } from "./common";
import { UserType } from "../types/user";
import { ReportType } from "../types/report";
import { EntityType } from "../types/entity";
import { IncidentType } from "../types/incidents";


export const incidentEmbedding = (reports: Record<string, any>[]) => {
    reports = reports.filter((report) => report.embedding);
    return reports.length == 0
        ? null
        : {
            vector: reports
                .map((report) => report.embedding!.vector)
                .reduce(
                    (sum, vector) => vector!.map((component: number, i: number) => component + sum[i]),
                    Array(reports[0].embedding!.vector!.length).fill(0)
                )
                .map((component: number) => component / reports.length),

            from_reports: reports.map((report) => report.report_number),
        };
};

export const queryFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateQueryFields({ collectionName: 'incidents', Type: IncidentType })
}



const LinkReportsToIncidentsInput = new GraphQLInputObjectType({
    name: 'LinkReportsToIncidentsInput',
    fields: {
        incident_ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
        report_numbers: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    },
});

export const mutationFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateMutationFields({ collectionName: 'incidents', Type: IncidentType, generateFields: ['insertOne', 'updateOne', 'updateMany'] }),

    linkReportsToIncidents: {
        type: new GraphQLList(IncidentType),
        args: {
            input: {
                type: new GraphQLNonNull(LinkReportsToIncidentsInput)
            }
        },
        resolve: getQueryResolver(IncidentType, async (filter, projection, options, obj, args, context) => {

            await linkReportsToIncidents(context.client, args.input.report_numbers, args.input.incident_ids);

            const incidentsCollection = context.client.db('aiidprod').collection("incidents");

            return incidentsCollection.find({ reports: { $in: args.input.report_numbers } }, options).toArray();
        })
    },

    flagIncidentSimilarity: {
        type: IncidentType,
        args: {
            incidentId: { type: new GraphQLNonNull(GraphQLInt) },
            dissimilarIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
        },
        resolve: getQueryResolver(IncidentType, async (filter, projection, options, obj, args, context) => {

            const incidentsCollection = context.client.db('aiidprod').collection<{ editors: string[] }>("incidents");

            await incidentsCollection.updateOne({ incident_id: args.incidentId }, { $set: { flagged_dissimilar_incidents: args.dissimilarIds } });

            if (context?.user?.id) {

                await incidentsCollection.updateOne({ incident_id: args.incidentId }, { $addToSet: { editors: context.user.id } });
            }

            return incidentsCollection.findOne({ incident_id: args.incidentId }, options);
        })
    },
}

export const permissions = {
    Query: {
        incident: allow,
        incidents: allow,
    },
    Mutation: {
        insertOneIncident: isRole('incident_editor'),
        updateOneIncident: isRole('incident_editor'),
        updateManyIncidents: isRole('incident_editor'),
        linkReportsToIncidents: isRole('incident_editor'),
        flagIncidentSimilarity: allow,
    }
}