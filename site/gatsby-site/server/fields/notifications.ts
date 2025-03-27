import { GraphQLFieldConfigMap } from 'graphql';
import { generateQueryFields } from '../utils';
import { Context } from '../interfaces';
import { NotificationType } from '../types/notification';
import { isRole } from '../rules';

export const queryFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateQueryFields({ databaseName: 'customData', collectionName: 'notifications', Type: NotificationType })
}
export const permissions = {
    Query: {
        notification: isRole('admin'),
        notifications: isRole('admin'),
    },
}