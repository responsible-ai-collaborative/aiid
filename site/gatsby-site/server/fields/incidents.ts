import { GraphQLFieldConfigMap, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { allow } from "graphql-shield";
import { generateMutationFields, generateQueryFields } from "../utils";
import { ReportType } from "./reports";
import { getMongoDbQueryResolver } from "graphql-to-mongodb";
import { Context } from "../interfaces";
import { ObjectId } from "mongodb";
import { ObjectIdScalar } from "../scalars";

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

//@ts-ignore // this is to 
IncidentType.getFields().reports.dependencies = [];

export const queryFields: GraphQLFieldConfigMap<any, any> = {

    ...generateQueryFields({ collectionName: 'incidents', Type: IncidentType })
}

export const mutationFields: GraphQLFieldConfigMap<any, any> = {

    ...generateMutationFields({ collectionName: 'incidents', Type: IncidentType }),
}

export const permissions = {
    Query: {
        incident: allow,
        incidents: allow,
    },
    Mutation: {
    }
}