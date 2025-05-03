import { GraphQLFieldConfigMap, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLBoolean } from "graphql";
import { allow } from "graphql-shield";
import { isRole } from "../rules";
import { generateMutationFields, generateQueryFields } from "../utils";
import { Context } from "../interfaces";
import { EntityType } from "../types/entity";
import { GraphQLDateTime, GraphQLJSONObject } from "graphql-scalars";
import { mergeEntities, findSimilarEntities, SimilarEntityPair } from "../shared/entities";
import { Entity } from "../generated/graphql";

const SimilarEntityPairType = new GraphQLObjectType({
  name: 'SimilarEntityPair',
  fields: {
    entityId1: { type: new GraphQLNonNull(GraphQLString) },
    entityName1: { type: new GraphQLNonNull(GraphQLString) },
    entityId2: { type: new GraphQLNonNull(GraphQLString) },
    entityName2: { type: new GraphQLNonNull(GraphQLString) },
    similarity: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const SimilarEntitiesResultType = new GraphQLObjectType({
  name: 'SimilarEntitiesResult',
  fields: {
    pairs: { type: new GraphQLNonNull(new GraphQLList(SimilarEntityPairType)) },
    hasMore: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
});

export const queryFields: GraphQLFieldConfigMap<any, Context> = {
  ...generateQueryFields({ collectionName: 'entities', Type: EntityType }),
  similarEntities: {
    type: SimilarEntitiesResultType,
    args: {
      threshold: { type: new GraphQLNonNull(GraphQLInt) },
      offset: { type: GraphQLInt },
      limit: { type: GraphQLInt },
    },
    resolve: async (_source, { threshold, offset = 0, limit }, context) => {

      const cursor = context.client.db('aiidprod')
        .collection('entities')
        .find()
        .sort({ entity_id: 1 })
        .skip(offset);

      let docs: any[];
      let hasMore = false;

      if (limit != null) {

        const docsWithExtra = await cursor.limit(limit + 1).toArray();

        hasMore = docsWithExtra.length > limit;
        docs = docsWithExtra.slice(0, limit);
      }
      else {
      
        docs = await cursor.toArray();
      }

      const entitiesList: Entity[] = docs.map(doc => ({
        entity_id: doc.entity_id,
        name: doc.name,
        created_at: doc.created_at,
        date_modified: doc.date_modified,
      }));

      const pairs = findSimilarEntities(entitiesList, threshold);
      
      return { pairs, hasMore };
    }
  }
}

const UpdateOneEntityPayload = new GraphQLObjectType({
  name: 'UpdateOneEntityPayload',
  fields: {
    created_at: { type: GraphQLDateTime },
    date_modified: { type: GraphQLDateTime },
    entity_id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    entity_relationships_to_add: { type: new GraphQLList(GraphQLString) },
    entity_relationships_to_remove: { type: new GraphQLList(GraphQLString) },
  },
});

const UpdateOneEntityInput = new GraphQLInputObjectType({
  name: 'UpdateOneEntityInput',
  fields: {
    created_at: { type: GraphQLDateTime },
    date_modified: { type: GraphQLDateTime },
    entity_id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    entity_relationships_to_add: { type: new GraphQLList(GraphQLJSONObject) },
    entity_relationships_to_remove: { type: new GraphQLList(GraphQLJSONObject) },
  },
});

export const mutationFields: GraphQLFieldConfigMap<any, Context> = {

  ...generateMutationFields({ collectionName: 'entities', Type: EntityType, generateFields: ['updateOne', 'upsertOne'] }),

  updateEntityAndRelationships: {
    type: new GraphQLNonNull(UpdateOneEntityPayload),
    args: {
      input: { type: new GraphQLNonNull(UpdateOneEntityInput) },
    },

    resolve: async (_source, { input }, context) => {

      const entities = context.client.db('aiidprod').collection("entities");
      const entity_relationships = context.client.db('aiidprod').collection("entity_relationships");

      const target = await entities.findOne({ entity_id: input.entity_id });

      if (!target) {
        throw new Error('Entity not found');
      }

      const { _id: undefined, ...entity } = target;

      const updatedInput = {
        ...input,
      }
      delete updatedInput._id;
      delete updatedInput.entity_relationships_to_add
      delete updatedInput.entity_relationships_to_remove

      await entities.updateOne({ entity_id: input.entity_id }, { $set: { ...updatedInput } });

      const newRelationships = input.entity_relationships_to_add.map((entity_relationship: any) => ({
        sub: updatedInput.entity_id,
        obj: entity_relationship.id,
        is_symmetric: true,
        pred: 'related',
      }))

      if (newRelationships.length > 0) {
        await entity_relationships.insertMany(newRelationships);
      }

      const oldRelationships = input.entity_relationships_to_remove.map((entity_relationship: any) => ({
        sub: updatedInput.entity_id,
        obj: entity_relationship.id,
        is_symmetric: true,
        pred: 'related',
      }))

      if (oldRelationships.length > 0) {
        await entity_relationships.deleteMany({ $or: oldRelationships.map((entity_relationship: any) => ({ sub: entity_relationship.sub, obj: entity_relationship.obj })) });
      }

      return {
        ...input
      };
    }
  },
  mergeEntities: {
    type: new GraphQLNonNull(EntityType),
    args: {
      primaryId: { type: new GraphQLNonNull(GraphQLString) },
      secondaryId: { type: new GraphQLNonNull(GraphQLString) },
      keepEntity: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (_source, { primaryId, secondaryId, keepEntity }, context) => {

      await mergeEntities(primaryId, secondaryId, keepEntity, context.client);
      const mergedId = keepEntity === 1 ? primaryId : secondaryId;
      const merged = await context.client.db('aiidprod').collection('entities').findOne({ entity_id: mergedId });
      return merged;
    }
  }
}

export const permissions = {
  Query: {
    entity: allow,
    entities: allow,
    similarEntities: allow,
  },
  Mutation: {
    updateEntityAndRelationships: allow,
    upsertOneEntity: allow,
    updateOneEntity: allow,
    mergeEntities: isRole('incident_editor')
  }
}
