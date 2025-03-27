import { GraphQLFieldConfigMap, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { allow } from "graphql-shield";
import { generateMutationFields, generateQueryFields } from "../utils";
import { Context } from "../interfaces";
import { EntityType } from "../types/entity";
import { GraphQLDateTime, GraphQLJSONObject } from "graphql-scalars";

export const queryFields: GraphQLFieldConfigMap<any, Context> = {

  ...generateQueryFields({ collectionName: 'entities', Type: EntityType })
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
  }
}

export const permissions = {
  Query: {
    entity: allow,
    entities: allow,
  },
  Mutation: {
    updateEntityAndRelationships: allow,
    upsertOneEntity: allow,
    updateOneEntity: allow
  }
}