import { GraphQLFieldConfigMap, GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { allow } from "graphql-shield";
import { generateMutationFields, generateQueryFields, incidentEmbedding } from "../utils";
import { ReportType } from "./reports";
import { getMongoDbQueryResolver } from "graphql-to-mongodb";
import { Context } from "../interfaces";
import { ObjectId } from "mongodb";
import { ObjectIdScalar } from "../scalars";
import { Incident, Report } from "../generated/graphql";
import { isAdmin } from "../rules";

const EmbeddingType = new GraphQLObjectType({
    name: 'IncidentEmbedding',
    fields: {
        from_reports: { type: new GraphQLList(GraphQLInt) },
        vector: { type: new GraphQLList(GraphQLFloat) }
    }
});

const TsneType = new GraphQLObjectType({
    name: 'Tsne',
    fields: {
        x: { type: GraphQLFloat },
        y: { type: GraphQLFloat }
    }
});

const NlpSimilarIncidentType = new GraphQLObjectType({
    name: 'NlpSimilarIncident',
    fields: {
        incident_id: { type: GraphQLInt },
        similarity: { type: GraphQLFloat }
    }
});

const IncidentType = new GraphQLObjectType({
    name: 'Incident',
    fields: {
        _id: { type: ObjectIdScalar },
        date: { type: GraphQLString },
        description: { type: GraphQLString },
        editor_notes: { type: GraphQLString },
        epoch_date_modified: { type: GraphQLInt },
        incident_id: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        alleged_deployer_of_AI_system: { type: new GraphQLList(GraphQLString) },
        alleged_developer_of_AI_system: { type: new GraphQLList(GraphQLString) },
        alleged_harmed_or_nearly_harmed_parties: { type: new GraphQLList(GraphQLString) },
        editor_dissimilar_incidents: { type: new GraphQLList(GraphQLInt) },
        editor_similar_incidents: { type: new GraphQLList(GraphQLInt) },
        editors: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) },
        embedding: { type: EmbeddingType },
        flagged_dissimilar_incidents: { type: new GraphQLList(GraphQLInt) },
        nlp_similar_incidents: { type: new GraphQLList(NlpSimilarIncidentType) },
        reports: {
            type: new GraphQLNonNull(new GraphQLList(ReportType)),
            resolve: getMongoDbQueryResolver(ReportType, async (filter, projection, options, source: { _id: ObjectId }, args, context: Context) => {

                const db = context.client.db('aiidprod');

                const incidentsCollection = db.collection('incidents');
                const reportsCollection = db.collection('reports');

                const incident = await incidentsCollection.findOne({ _id: source._id }, { projection: { reports: 1 } });

                const result = await reportsCollection.find({ report_number: { $in: incident?.reports } }, options).toArray();

                return result;
            }),
        },
        tsne: { type: TsneType }
    },
});

//@ts-ignore // fix graphql-tools warning
IncidentType.getFields().reports.dependencies = [];



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

    ...generateMutationFields({ collectionName: 'incidents', Type: IncidentType }),

    linkReportsToIncidents: {
        type: new GraphQLList(IncidentType),
        args: {
            input: {
                type: new GraphQLNonNull(LinkReportsToIncidentsInput)
            }
        },
        resolve: getMongoDbQueryResolver(IncidentType, async (filter, projection, options, obj, args, context) => {

            const incidentsCollection = context.client.db('aiidprod').collection<Omit<Incident, 'reports'> & { reports: number[] }>("incidents");
            const reportsCollection = context.client.db('aiidprod').collection<Report>("reports");

            // unlink

            const exParentIncidents = await incidentsCollection.find({ reports: { $in: args.input.report_numbers } }).toArray();

            for (const incident of exParentIncidents) {

                const reports = await reportsCollection.find({ report_number: { $in: incident.reports.filter(number => !args.input.report_numbers.includes(number)) } }).toArray();

                const embedding = incidentEmbedding(reports);

                const operation = embedding == null ? { $unset: { embedding: "" } } : { $set: { embedding } }

                await incidentsCollection.updateOne({ incident_id: incident.incident_id }, operation);
            }

            await incidentsCollection.updateMany({ reports: { $in: args.input.report_numbers } }, { $pull: { reports: { $in: args.input.report_numbers } } });


            // link

            if (args.input.incident_ids.length > 0) {

                await incidentsCollection.updateMany({ incident_id: { $in: args.input.incident_ids } }, { $addToSet: { reports: { $each: args.input.report_numbers } } });

                const parentIncidents = await incidentsCollection.find({ reports: { $in: args.input.report_numbers } }).toArray();

                for (const incident of parentIncidents) {

                    const reports = await reportsCollection.find({ report_number: { $in: incident.reports } }).toArray();

                    const embedding = incidentEmbedding(reports);

                    const operation = embedding == null ? { $unset: { embedding: "" } } : { $set: { embedding } }

                    await incidentsCollection.updateOne({ incident_id: incident.incident_id }, operation);
                }
            }

            //

            await reportsCollection.updateMany(
                {
                    report_number: { $in: args.input.report_numbers },
                    title: { $nin: [""] },
                    url: { $nin: [""] },
                    source_domain: { $nin: [""] },
                },
                {
                    $set: { is_incident_report: args.input.incident_ids.length > 0 }
                }
            );

            return incidentsCollection.find({ reports: { $in: args.input.report_numbers } }, options).toArray();
        })
    }
}

export const permissions = {
    Query: {
        incident: allow,
        incidents: allow,
    },
    Mutation: {
        deleteOneIncident: isAdmin,
        deleteManyIncidents: isAdmin,
        insertOneIncident: isAdmin,
        insertManyIncidents: isAdmin,
        updateOneIncident: isAdmin,
        updateManyIncidents: isAdmin,
        linkReportsToIncidents: allow,
    }
}