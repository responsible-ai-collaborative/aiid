import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { getListRelationshipConfig, getRelationshipConfig } from "../utils";
import { NlpSimilarIncidentType } from "./types";
import { EntityType } from "../types/entity";
import { GraphQLLong } from "graphql-scalars";
import { ObjectIdScalar } from "../scalars";
import { UserType } from "./user";


const EmbeddingType = new GraphQLObjectType({
    name: 'Embedding',
    fields: () => ({
        from_text_hash: { type: GraphQLString },
        vector: { type: new GraphQLList(GraphQLFloat) }
    })
});


export const SubmissionType = new GraphQLObjectType({
    name: 'Submission',
    fields: () => ({
        _id: { type: ObjectIdScalar },
        authors: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        cloudinary_id: { type: GraphQLString },
        date_downloaded: { type: new GraphQLNonNull(GraphQLString) },
        date_modified: { type: new GraphQLNonNull(GraphQLString) },
        date_published: { type: new GraphQLNonNull(GraphQLString) },
        date_submitted: { type: new GraphQLNonNull(GraphQLString) },
        deployers: getListRelationshipConfig(EntityType, GraphQLString, 'deployers', 'entity_id', 'entities', 'aiidprod'),
        description: { type: GraphQLString },
        developers: getListRelationshipConfig(EntityType, GraphQLString, 'developers', 'entity_id', 'entities', 'aiidprod'),
        editor_dissimilar_incidents: { type: new GraphQLList(GraphQLInt) },
        editor_notes: { type: GraphQLString },
        editor_similar_incidents: { type: new GraphQLList(GraphQLInt) },
        embedding: { type: EmbeddingType },
        epoch_date_modified: { type: GraphQLLong },
        harmed_parties: getListRelationshipConfig(EntityType, GraphQLString, 'harmed_parties', 'entity_id', 'entities', 'aiidprod'),
        image_url: { type: new GraphQLNonNull(GraphQLString) },
        incident_date: { type: GraphQLString },
        incident_editors: getListRelationshipConfig(UserType, GraphQLString, 'incident_editors', 'userId', 'users', 'customData'),
        incident_ids: { type: new GraphQLList(GraphQLInt) },
        incident_title: { type: GraphQLString },
        language: { type: new GraphQLNonNull(GraphQLString) },
        nlp_similar_incidents: { type: new GraphQLList(NlpSimilarIncidentType) },
        plain_text: { type: GraphQLString },
        source_domain: { type: new GraphQLNonNull(GraphQLString) },
        submitters: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        tags: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        url: { type: new GraphQLNonNull(GraphQLString) },
        user: getRelationshipConfig(UserType, GraphQLString, 'user', 'userId', 'users', 'customData'),
        status: { type: GraphQLString },
        quiet: { type: GraphQLBoolean },
        implicated_systems: getListRelationshipConfig(EntityType, GraphQLString, 'implicated_systems', 'entity_id', 'entities', 'aiidprod'),
    })
});

//@ts-ignore
SubmissionType.getFields().deployers.dependencies = ['deployers']
//@ts-ignore
SubmissionType.getFields().developers.dependencies = ['developers']
//@ts-ignore
SubmissionType.getFields().harmed_parties.dependencies = ['harmed_parties']
//@ts-ignore
SubmissionType.getFields().incident_editors.dependencies = ['incident_editors']
//@ts-ignore
SubmissionType.getFields().user.dependencies = ['user']
//@ts-ignore
SubmissionType.getFields().implicated_systems.dependencies = ['implicated_systems']
