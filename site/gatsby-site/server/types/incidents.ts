import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ObjectIdScalar } from "../scalars";
import { EntityType } from "./entity";
import { getListRelationshipConfig, getListRelationshipExtension, getListRelationshipResolver } from "../utils";
import { UserType } from "./user";
import { NlpSimilarIncidentType } from "./types";
import { ReportType } from "./report";

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

export const IncidentType = new GraphQLObjectType({
    name: 'Incident',
    fields: {
        _id: { type: ObjectIdScalar },
        date: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        editor_notes: { type: new GraphQLNonNull(GraphQLString) },
        epoch_date_modified: { type: GraphQLInt },
        incident_id: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        AllegedDeployerOfAISystem: {
            type: new GraphQLList(EntityType),
            resolve: getListRelationshipResolver('AllegedDeployerOfAISystem', 'entity_id', EntityType, 'aiidprod', 'entities', 'Alleged deployer of AI system'),
            extensions: {
                relationship: getListRelationshipExtension('AllegedDeployerOfAISystem', 'entity_id', GraphQLString, 'aiidprod', 'entities'),
                dbMapping: 'Alleged deployer of AI system',
            },
        },
        AllegedDeveloperOfAISystem: {
            type: new GraphQLList(EntityType),
            resolve: getListRelationshipResolver('AllegedDeveloperOfAISystem', 'entity_id', EntityType, 'aiidprod', 'entities', 'Alleged developer of AI system'),
            extensions: {
                relationship: getListRelationshipExtension('AllegedDeveloperOfAISystem', 'entity_id', GraphQLString, 'aiidprod', 'entities'),
                dbMapping: 'Alleged developer of AI system',
            },
        },
        AllegedHarmedOrNearlyHarmedParties: {
            type: new GraphQLList(EntityType),
            resolve: getListRelationshipResolver('AllegedHarmedOrNearlyHarmedParties', 'entity_id', EntityType, 'aiidprod', 'entities', 'Alleged harmed or nearly harmed parties'),
            extensions: {
                relationship: getListRelationshipExtension('AllegedHarmedOrNearlyHarmedParties', 'entity_id', GraphQLString, 'aiidprod', 'entities'),
                dbMapping: 'Alleged harmed or nearly harmed parties',
            },
        },
        editor_dissimilar_incidents: { type: new GraphQLList(GraphQLInt) },
        editor_similar_incidents: { type: new GraphQLList(GraphQLInt) },
        editors: getListRelationshipConfig(UserType, GraphQLString, 'editors', 'userId', 'users', 'customData'),
        embedding: { type: EmbeddingType },
        flagged_dissimilar_incidents: { type: new GraphQLNonNull(new GraphQLList(GraphQLInt)) },
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
