import { GraphQLFieldConfigMap, GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { allow } from "graphql-shield";
import { generateMutationFields, generateQueryFields, getListRelationshipConfig, getListRelationshipExtension, getListRelationshipResolver, getQueryResolver } from "../utils";
import { ReportType } from "./reports";
import { Context } from "../interfaces";
import { ObjectIdScalar } from "../scalars";
import { isRole } from "../rules";
import { EntityType } from "./entities";
import { UserType } from "./users";
import { NlpSimilarIncidentType } from "../types";
import { linkReportsToIncidents } from "./common";


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


const EmbeddingType = new GraphQLObjectType({
    name: 'IncidentEmbedding',
    fields: {
        from_reports: { type: new GraphQLList(GraphQLInt) },
        vector: { type: new GraphQLList(GraphQLFloat) }
    }
});

const TsneType = new GraphQLObjectType({
    name: 'IncidentTsne',
    fields: {
        x: { type: GraphQLFloat },
        y: { type: GraphQLFloat }
    }
});

const IncidentType = new GraphQLObjectType({
    name: 'Incident',
    fields: {
        _id: { type: ObjectIdScalar },
        date: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        editor_notes: { type: GraphQLString },
        epoch_date_modified: { type: GraphQLInt },
        incident_id: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        AllegedDeployerOfAISystem: {
            type: new GraphQLList(EntityType),
            resolve: getListRelationshipResolver('AllegedDeployerOfAISystem', 'entity_id', EntityType, 'aiidprod', 'entities', 'Alleged deployer of AI system'),
            extensions: {
                relationship: getListRelationshipExtension('AllegedDeployerOfAISystem', 'entity_id', GraphQLString, 'aiidprod', 'entities')
            },
        },
        AllegedDeveloperOfAISystem: {
            type: new GraphQLList(EntityType),
            resolve: getListRelationshipResolver('AllegedDeveloperOfAISystem', 'entity_id', EntityType, 'aiidprod', 'entities', 'Alleged developer of AI system'),
            extensions: {
                relationship: getListRelationshipExtension('AllegedDeveloperOfAISystem', 'entity_id', GraphQLString, 'aiidprod', 'entities')
            },
        },
        AllegedHarmedOrNearlyHarmedParties: {
            type: new GraphQLList(EntityType),
            resolve: getListRelationshipResolver('AllegedHarmedOrNearlyHarmedParties', 'entity_id', EntityType, 'aiidprod', 'entities', 'Alleged harmed or nearly harmed parties'),
            extensions: {
                relationship: getListRelationshipExtension('AllegedHarmedOrNearlyHarmedParties', 'entity_id', GraphQLString, 'aiidprod', 'entities')
            },
        },
        editor_dissimilar_incidents: { type: new GraphQLList(GraphQLInt) },
        editor_similar_incidents: { type: new GraphQLList(GraphQLInt) },
        editors: getListRelationshipConfig(UserType, GraphQLString, 'editors', 'userId', 'users', 'customData'),
        embedding: { type: EmbeddingType },
        flagged_dissimilar_incidents: { type: new GraphQLList(GraphQLInt) },
        nlp_similar_incidents: { type: new GraphQLList(NlpSimilarIncidentType) },
        reports: getListRelationshipConfig(ReportType, GraphQLInt, 'reports', 'report_number', 'reports', 'aiidprod'),
        tsne: { type: TsneType }
    },
});

// dependencies property gets ignored by newest graphql package so we have to add it manually after the type is created
// ideally should be fixed in the graphql-to-mongodb package

//@ts-ignore 
IncidentType.getFields().reports.dependencies = ['reports'];
//@ts-ignore 
IncidentType.getFields().AllegedDeployerOfAISystem.dependencies = ['Alleged deployer of AI system'];
//@ts-ignore 
IncidentType.getFields().AllegedDeveloperOfAISystem.dependencies = ['Alleged developer of AI system'];
//@ts-ignore 
IncidentType.getFields().AllegedHarmedOrNearlyHarmedParties.dependencies = ['Alleged harmed or nearly harmed parties'];
//@ts-ignore 
IncidentType.getFields().editors.dependencies = ['editors'];


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