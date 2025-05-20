import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { ObjectIdScalar } from '../scalars';

export const EntityDuplicateType = new GraphQLObjectType({
  name: 'EntityDuplicate',
  fields: () => ({
    _id: { type: ObjectIdScalar },
    duplicate_entity_id: { type: new GraphQLNonNull(GraphQLString) },
    true_entity_id: { type: new GraphQLNonNull(GraphQLString) },
  }),
});