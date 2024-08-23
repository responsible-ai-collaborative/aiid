import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import { ObjectIdScalar } from "../scalars";
import { GraphQLDateTime } from "graphql-scalars";
import { EntityType } from "./entity";
import { getListRelationshipConfig } from "../utils";

export const Entity_relationshipType = new GraphQLObjectType({
  name: 'Entity_relationship',
  fields: {
    _id: { type: ObjectIdScalar },
    pred: { type: GraphQLString },
    is_symmetric: { type: GraphQLBoolean },
    obj: getListRelationshipConfig(EntityType, GraphQLString, 'obj', 'entity_id', 'entities', 'aiidprod'),
    sub: getListRelationshipConfig(EntityType, GraphQLString, 'sub', 'entity_id', 'entities', 'aiidprod'),
    created_at: { type: GraphQLDateTime },
  },
});
