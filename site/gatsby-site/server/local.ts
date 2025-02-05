import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { shield, deny } from 'graphql-shield';
import { applyMiddleware } from 'graphql-middleware';
import { ObjectIdScalar } from './scalars';

import {
    queryFields as quickAddsQueryFields,
    mutationFields as quickAddsMutationFields,
    permissions as quickAddsPermissions,
} from './fields/quickadds';

import {
    queryFields as reportsQueryFields,
    mutationFields as reportsMutationFields,
    permissions as reportsPermissions
} from './fields/reports';

import {
    queryFields as entitiesQueryFields,
    mutationFields as entitiesMutationFields,
    permissions as entitiesPermissions
} from './fields/entities';

import {
    queryFields as usersQueryFields,
    mutationFields as usersMutationFields,
    permissions as usersPermissions
} from './fields/users';

import {
    queryFields as incidentsQueryFields,
    mutationFields as incidentsMutationFields,
    permissions as incidentsPermissions
} from './fields/incidents';

import {
  queryFields as submissionsQueryFields,
  mutationFields as submissionsMutationFields,
  permissions as submissionsPermissions
} from './fields/submissions';

import {
  queryFields as entity_relationshipsQueryFields,
  mutationFields as entity_relationshipsMutationFields,
  permissions as entity_relationshipsPermissions
} from './fields/entity_relationships';

import {
    queryFields as classificationsQueryFields,
    mutationFields as classificationsMutationFields,
    permissions as classificationsPermissions
} from './fields/classifications';

import {
    queryFields as taxaQueryFields,
    permissions as taxaPermissions
} from './fields/taxa';

import {
    queryFields as candidatesQueryFields,
    mutationFields as candidatesMutationFields,
    permissions as candidatesPermissions
} from './fields/candidates';

import {
    queryFields as subscriptionsQueryFields,
    mutationFields as subscriptionsMutationFields,
    permissions as subscriptionsPermissions
} from './fields/subscriptions';

import {
    queryFields as duplicatesQueryFields,
    mutationFields as duplicatesMutationFields,
    permissions as duplicatesPermissions
} from './fields/duplicates';

import {
    queryFields as notificationsQueryFields,
    permissions as notificationsPermissions
} from './fields/notifications';

import {
    queryFields as reportsHistoryQueryFields,
    permissions as reportsHistoryPermissions
} from './fields/reportsHistory';

import {
    queryFields as incidentsHistoryQueryFields,
    permissions as incidentsHistoryPermissions,
} from './fields/incidentsHistory';

import {
    queryFields as checklistsQueryFields,
    mutationFields as checklistsMutationFields,
    permissions as checklistsPermissions
} from './fields/checklists';


export const getSchema = () => {

    const query = new GraphQLObjectType({
        name: 'Query',
        fields: {
            ObjectId: {
                type: ObjectIdScalar,
                description: 'Custom scalar for MongoDB ObjectID',
            },
            ...quickAddsQueryFields,
            ...reportsQueryFields,
            ...incidentsQueryFields,
            ...entitiesQueryFields,
            ...usersQueryFields,
            ...submissionsQueryFields,
            ...entity_relationshipsQueryFields,
            ...classificationsQueryFields,
            ...taxaQueryFields,
            ...candidatesQueryFields,
            ...subscriptionsQueryFields,
            ...duplicatesQueryFields,
            ...notificationsQueryFields,
            ...reportsHistoryQueryFields,
            ...incidentsHistoryQueryFields,
            ...checklistsQueryFields,
        }
    });

    const mutation = new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            ...quickAddsMutationFields,
            ...reportsMutationFields,
            ...incidentsMutationFields,
            ...entitiesMutationFields,
            ...usersMutationFields,
            ...submissionsMutationFields,
            ...entity_relationshipsMutationFields,
            ...classificationsMutationFields,
            ...candidatesMutationFields,
            ...subscriptionsMutationFields,
            ...duplicatesMutationFields,
            ...checklistsMutationFields,
        }
    });

    const schema = new GraphQLSchema({
        query,
        mutation,
    })

    /**
     * Configures permissions for the GraphQL API using graphql-shield.
     * 
     * The `shield` function is used to define the permissions for queries and mutations, with default access set to deny (`deny`).
     * Permissions are then selectively granted using specific permissions configurations (e.g., `quickAddsPermissions`, `reportsPermissions`).
     * 
     * @constant
     * @type {RuleTree}
     * 
     * @property {Object} Query - Permissions for Query fields. All fields are denied access by default, with specific permissions set explicitly.
     * @property {Object} Mutation - Permissions for Mutation fields. All fields are denied access by default, with specific permissions set explicitly.
     * @property {boolean} allowExternalErrors - Determines whether to allow external errors to be displayed. Set to `true` or based on the environment.
     *                                           This helps in debugging by providing more detailed error messages during development.
     */
    const permissions = shield(
        {
            Query: {
                "*": deny,
                ...quickAddsPermissions.Query,
                ...reportsPermissions.Query,
                ...incidentsPermissions.Query,
                ...entitiesPermissions.Query,
                ...usersPermissions.Query,
                ...submissionsPermissions.Query,
                ...entity_relationshipsPermissions.Query,
                ...classificationsPermissions.Query,
                ...taxaPermissions.Query,
                ...candidatesPermissions.Query,
                ...subscriptionsPermissions.Query,
                ...duplicatesPermissions.Query,
                ...notificationsPermissions.Query,
                ...reportsHistoryPermissions.Query,
                ...incidentsHistoryPermissions.Query,
                ...checklistsPermissions.Query,
            },
            Mutation: {
                "*": deny,
                ...quickAddsPermissions.Mutation,
                ...reportsPermissions.Mutation,
                ...incidentsPermissions.Mutation,
                ...entitiesPermissions.Mutation,
                ...usersPermissions.Mutation,
                ...submissionsPermissions.Mutation,
                ...entity_relationshipsPermissions.Mutation,
                ...classificationsPermissions.Mutation,
                ...candidatesPermissions.Mutation,
                ...subscriptionsPermissions.Mutation,
                ...duplicatesPermissions.Mutation,
                ...checklistsPermissions.Mutation
            },
        },
        {
            allowExternalErrors: process.env.NODE_ENV !== 'production',
        }
    );

    const schemaWithAuth = applyMiddleware(schema, permissions)

    return schemaWithAuth;
}
