import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { ObjectIdScalar } from '../scalars';
import { getRelationshipConfig } from '../utils';
import { EntityType } from './entity';
import { IncidentType } from './incidents';
import { UserType } from './user';

export const SubscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    _id: { type: ObjectIdScalar },
    // TODO: this field should be called `entity`
    entityId: getRelationshipConfig(EntityType, GraphQLString, 'entityId', 'entity_id', 'entities', 'aiidprod'),
    // TODO: this field should be called `incident`
    incident_id: getRelationshipConfig(IncidentType, GraphQLInt, 'incident_id', 'incident_id', 'incidents', 'aiidprod'),
    type: { type: new GraphQLNonNull(GraphQLString) },
    // TODO: this field should be called `user`
    userId: getRelationshipConfig(UserType, GraphQLString, 'userId', 'userId', 'users', 'customData'),
  },
});

//@ts-ignore 
SubscriptionType.getFields().entityId.dependencies = ['entityId'];

//@ts-ignore 
SubscriptionType.getFields().incident_id.dependencies = ['incident_id'];

//@ts-ignore 
SubscriptionType.getFields().userId.dependencies = ['userId'];
