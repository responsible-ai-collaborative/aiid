import { GraphQLFieldConfigMap, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull } from "graphql";
import { allow } from "graphql-shield";
import { generateMutationFields, generateQueryFields, getQueryResolver } from "../utils";
import { Context } from "../interfaces";
import { isRole } from "../rules";
import { createNotificationsOnNewIncident, createNotificationsOnUpdatedIncident, hasRelevantUpdates, linkReportsToIncidents } from "./common";
import { IncidentType } from "../types/incidents";

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

    ...generateMutationFields({
        collectionName: 'incidents',
        Type: IncidentType,
        generateFields: ['insertOne', 'updateOne', 'updateMany'],
        onResolve: async (operation, context, params) => {

            const { result, initial } = params!;

            if (operation === 'insertOne') {

                await createNotificationsOnNewIncident(result, context);
            }

            if (operation === 'updateOne') {

                if (hasRelevantUpdates(initial, result)) {

                    await createNotificationsOnUpdatedIncident(result, initial, context);
                }
            }

            return result;
        },
    }),

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