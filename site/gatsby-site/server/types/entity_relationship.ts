import { GraphQLBoolean, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { ObjectIdScalar } from "../scalars";
import { GraphQLDateTime } from "graphql-scalars";
import { EntityType } from "./entity";
import { getListRelationshipExtension, getListRelationshipResolver } from "../utils";

export const Entity_relationshipType = new GraphQLObjectType({
  name: 'Entity_relationship',
  fields: {
    _id: { type: ObjectIdScalar },
    pred: { type: GraphQLString },
    is_symmetric: { type: GraphQLBoolean },
    obj: {
      type: new GraphQLList(EntityType),
      resolve: getListRelationshipResolver('obj', 'entity_id', EntityType, 'aiidprod', 'entities', 'obj'),
      extensions: {
        relationship: getListRelationshipExtension('obj', 'entity_id', GraphQLString, 'aiidprod', 'entities')
      },
    },
    sub: {
      type: new GraphQLList(EntityType),
      resolve: getListRelationshipResolver('obj', 'entity_id', EntityType, 'aiidprod', 'entities', 'obj'),
      extensions: {
        relationship: getListRelationshipExtension('obj', 'entity_id', GraphQLString, 'aiidprod', 'entities')
      },
    },
    created_at: { type: GraphQLDateTime },
  },
});
