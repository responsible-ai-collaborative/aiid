import { GraphQLObjectType, GraphQLInt } from 'graphql';
import { ObjectIdScalar } from '../scalars';

export const DuplicateType = new GraphQLObjectType({
    name: 'Duplicate',
    fields: () => ({
        _id: { type: ObjectIdScalar },
        duplicate_incident_number: { type: GraphQLInt },
        true_incident_number: { type: GraphQLInt },
    }),
});