import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { allow } from "graphql-shield";
import { generateMutationFields, generateQueryFields, getQueryResolver } from "../utils";
import { Context, DBIncident } from "../interfaces";
import { isRole } from "../rules";
import { createNotificationsOnNewIncident, createNotificationsOnUpdatedIncident, hasRelevantUpdates, linkReportsToIncidents, logIncidentHistory } from "./common";
import { IncidentType } from "../types/incidents";
import { GraphQLDateTime } from "graphql-scalars";

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

                await logIncidentHistory(result, context);

                await createNotificationsOnNewIncident(result, context);
            }

            if (operation === 'updateOne') {

                await logIncidentHistory(result, context);

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

            const incidentsCollection = context.client.db('aiidprod').collection<DBIncident>("incidents");


            const updates = await incidentsCollection.find({ incident_id: { $in: args.input.incident_ids } }).toArray();

            for (const updated of updates) {

                await logIncidentHistory(updated, context);
            }

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

            const incidentsCollection = context.client.db('aiidprod').collection<DBIncident>("incidents");

            await incidentsCollection.updateOne({ incident_id: args.incidentId }, { $set: { flagged_dissimilar_incidents: args.dissimilarIds } });

            if (context?.user?.id) {

                await incidentsCollection.updateOne({ incident_id: args.incidentId }, { $addToSet: { editors: context.user.id } });
            }

            const updated = await incidentsCollection.findOne({ incident_id: args.incidentId }, options);

            if (updated) {

                await logIncidentHistory(updated, context);
            }

            return updated;
        })
    },

    updateOneIncidentTranslation: {
        args: {
            input: {
                type: new GraphQLNonNull(new GraphQLInputObjectType({
                    name: 'UpdateOneIncidentTranslationInput',
                    fields: {
                        language: { type: new GraphQLNonNull(GraphQLString) },
                        incident_id: { type: new GraphQLNonNull(GraphQLInt) },
                        title: { type: new GraphQLNonNull(GraphQLString) },
                        description: { type: new GraphQLNonNull(GraphQLString) },
                        dirty: { type: GraphQLBoolean },
                    },
                }))
            }
        },
        type: IncidentType,
        resolve: getQueryResolver(IncidentType, async (filter, projection, options, obj, args, context) => {

            // update the translation in the `incidents` collection
            const translationsCollection = context.client.db('translations').collection("incidents");

            const translation = {
                title: args.input.title,
                description: args.input.description,
                language: args.input.language,
                dirty: args.input.dirty,
                modified_at: new Date(),
            };

            await translationsCollection.updateOne(
                { incident_id: args.input.incident_id, language: args.input.language },
                { $set: { ...translation } },
                { upsert: true }
            );

            const incidents = context.client.db('aiidprod').collection("incidents");

            const incident = await incidents.findOne({ incident_id: args.input.incident_id }, options);

            return incident;
        }),
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
        updateOneIncidentTranslation: isRole('incident_editor'),
    }
}