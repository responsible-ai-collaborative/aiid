import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { allow } from "graphql-shield";
import { isAdmin } from "../rules";
import { ObjectIdScalar } from "../scalars";
import { generateMutationFields, generateQueryFields } from "../utils";
import { GraphQLDateTime } from "graphql-scalars";

const CandidateType = new GraphQLObjectType({
  name: 'Candidate',
  fields: {
    _id: {
      type: ObjectIdScalar,
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    date_published: {
      type: new GraphQLNonNull(GraphQLString),
    },
    matching_keywords: {
      type: new GraphQLList(GraphQLString),
    },
    matching_harm_keywords: {
      type: new GraphQLList(GraphQLString),
    },
    matching_entities: {
      type: new GraphQLList(GraphQLString),
    },
    
    embedding: {
      type: new GraphQLObjectType({
        name: 'CandidateEmbedding',
        fields: {
          vector: {
            type: new GraphQLList(GraphQLInt)
          },
          source: {
            type: GraphQLString
          }
        }
      })
    },
    similarity: {
      type: GraphQLFloat,
    },
    match: {
      type: GraphQLBoolean,
    },
    created_at: {
      type: GraphQLDateTime
    },
    url: {
      type: new GraphQLNonNull(GraphQLString),
    },
    dismissed: {
      type: GraphQLBoolean,
    },
    text: {
      type: GraphQLString,
    },
    plain_text: {
      type: GraphQLString,
    },
  },
});

export const queryFields: GraphQLFieldConfigMap<any, any> = {

  ...generateQueryFields({ collectionName: 'candidates', Type: CandidateType })
}

export const mutationFields: GraphQLFieldConfigMap<any, any> = {

  ...generateMutationFields({ collectionName: 'candidates', Type: CandidateType }),
}

export const permissions = {
  Query: {
    candidate: allow,
    candidates: allow,
  },
  Mutation: {
    deleteOneCandidate: isAdmin,
    deleteManyCandidates: isAdmin,
    insertOneCandidate: allow,
    insertManyCandidates: isAdmin,
    updateOneCandidate: isAdmin,
    updateManyCandidates: isAdmin,
    upsertOneCandidate: isAdmin,
  }
}