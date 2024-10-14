import {
    GraphQLFieldConfigMap,
} from 'graphql';
import { generateMutationFields, generateQueryFields } from '../utils';
import { Context } from '../interfaces';
import { SubscriptionType } from '../types/subscription';
import { isSubscriptionOwner } from '../rules';


export const queryFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateQueryFields({ databaseName: 'customData', collectionName: 'subscriptions', Type: SubscriptionType })
}

export const mutationFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateMutationFields({ databaseName: 'customData', collectionName: 'subscriptions', Type: SubscriptionType, generateFields: ['deleteMany', 'updateOne', 'upsertOne'] }),
}

export const permissions = {
    Query: {
        subscription: isSubscriptionOwner(),
        subscriptions: isSubscriptionOwner(),
    },
    Mutation: {
        deleteManySubscriptions: isSubscriptionOwner(),
        updateOneSubscription: isSubscriptionOwner(),
        upsertOneSubscription: isSubscriptionOwner(),
    }
}