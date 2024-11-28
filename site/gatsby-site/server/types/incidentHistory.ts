import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ObjectIdScalar } from "../scalars";
import { IncidentEmbeddingType, NlpSimilarIncidentType, TsneType } from "./types";

export const IncidentHistoryType = new GraphQLObjectType({
    name: 'History_incident',
    fields: {
        _id: { type: ObjectIdScalar },
        AllegedDeployerOfAISystem: { type: new GraphQLList(GraphQLString), resolve: (source) => source['Alleged deployer of AI system'] },
        AllegedDeveloperOfAISystem: { type: new GraphQLList(GraphQLString), resolve: (source) => source['Alleged developer of AI system'] },
        AllegedHarmedOrNearlyHarmedParties: { type: new GraphQLList(GraphQLString), resolve: (source) => source['Alleged harmed or nearly harmed parties'] },
        date: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        modifiedBy: { type: GraphQLString },
        editor_dissimilar_incidents: { type: new GraphQLList(GraphQLInt) },
        editor_notes: { type: GraphQLString },
        editor_similar_incidents: { type: new GraphQLList(GraphQLInt) },
        editors: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        embedding: { type: IncidentEmbeddingType },
        epoch_date_modified: { type: GraphQLInt },
        flagged_dissimilar_incidents: { type: new GraphQLList(GraphQLInt) },
        incident_id: { type: new GraphQLNonNull(GraphQLInt) },
        nlp_similar_incidents: { type: new GraphQLList(NlpSimilarIncidentType) },
        reports: { type: new GraphQLNonNull(new GraphQLList(GraphQLInt)) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        tsne: { type: TsneType }
    }
});

//@ts-ignore 
IncidentHistoryType.getFields().reports.dependencies = ['reports'];

//@ts-ignore 
IncidentHistoryType.getFields().AllegedDeployerOfAISystem.dependencies = ['Alleged deployer of AI system'];

//@ts-ignore 
IncidentHistoryType.getFields().AllegedDeveloperOfAISystem.dependencies = ['Alleged developer of AI system'];

//@ts-ignore 
IncidentHistoryType.getFields().AllegedHarmedOrNearlyHarmedParties.dependencies = ['Alleged harmed or nearly harmed parties'];
