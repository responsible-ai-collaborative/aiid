import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';
import { GraphQLDateTime } from 'graphql-scalars';
import { ObjectIdScalar } from '../scalars';
import { getRelationshipConfig } from '../utils';
import { UserType } from './user';

export const NotificationType = new GraphQLObjectType({
    name: 'Notification',
    fields: () => ({
        _id: { type: ObjectIdScalar },
        incident_id: { type: GraphQLInt },
        report_number: { type: GraphQLInt },
        entity_id: { type: GraphQLString },
        isUpdate: { type: GraphQLBoolean },
        processed: { type: GraphQLBoolean },
        sentDate: { type: GraphQLDateTime },
        type: { type: GraphQLString },
        userId: getRelationshipConfig(UserType, GraphQLString, 'userId', 'userId', 'users', 'customData'),
    }),
});