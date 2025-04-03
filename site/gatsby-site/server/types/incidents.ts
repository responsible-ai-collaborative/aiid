import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ObjectIdScalar } from "../scalars";
import { EntityType } from "./entity";
import { getListRelationshipConfig, getListRelationshipExtension, getListRelationshipResolver, getRelationshipConfig } from "../utils";
import { UserType } from "./user";
import { IncidentEmbeddingType, NlpSimilarIncidentType, TsneType } from "./types";
import { ReportType } from "./report";
import { GraphQLDateTime } from "graphql-scalars";
import { Context } from "../interfaces";

const IncidentTranslationsType = new GraphQLObjectType({
    name: 'IncidentTranslations',
    fields: {
        language: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
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
        implicated_systems: getListRelationshipConfig(EntityType, GraphQLString, 'implicated_systems', 'entity_id', 'entities', 'aiidprod'),
        editor_dissimilar_incidents: { type: new GraphQLList(GraphQLInt) },
        editor_similar_incidents: { type: new GraphQLList(GraphQLInt) },
        editors: getListRelationshipConfig(UserType, GraphQLString, 'editors', 'userId', 'users', 'customData'),
        embedding: { type: IncidentEmbeddingType },
        flagged_dissimilar_incidents: { type: new GraphQLNonNull(new GraphQLList(GraphQLInt)) },
        nlp_similar_incidents: { type: new GraphQLList(NlpSimilarIncidentType) },
        reports: getListRelationshipConfig(ReportType, GraphQLInt, 'reports', 'report_number', 'reports', 'aiidprod'),
        tsne: { type: TsneType },
        created_at: { type: GraphQLDateTime },
        translations: {
            type: new GraphQLList(IncidentTranslationsType),
            args: {
                languages: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) }
            },
            resolve: async (source, args, context: Context) => {
                const translationsCollection = context.client.db('translations').collection("incidents");
            
                const translations = await translationsCollection.find({
                    incident_id: source.incident_id,
                    language: { $in: args.languages }
                }).toArray();

                console.log('translations', translations)
            
                return args.languages.map((language: string) => {
                    const translation = translations.find(t => t.language === language);
                
                    return translation ? {
                        language: language,
                        title: translation.title || "",
                        description: translation.description || "",
                    } : {
                        language: language,
                        title: null,
                        description: null,
                    };
                });
            },
        },
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
//@ts-ignore
IncidentType.getFields().implicated_systems.dependencies = ['implicated_systems'];
