import { buildHTTPExecutor, HeadersConfig } from '@graphql-tools/executor-http'
import { makeExecutableSchema } from '@graphql-tools/schema';
import { FilterObjectFields, FilterTypes } from '@graphql-tools/wrap';
import remoteTypeDefs from './remoteTypeDefs';
import config from './config';
import { ExecutionRequest } from '@graphql-tools/utils';

const userExecutor = buildHTTPExecutor({
    endpoint: `https://realm.mongodb.com/api/client/v2.0/app/${config.REALM_APP_ID}/graphql`,
    headers(executorRequest?: ExecutionRequest<any, any, any, Record<string, any>, any> | undefined): HeadersConfig {
        if (
            !executorRequest?.context.req.headers.authorization && executorRequest?.info?.operation.operation == 'query'
        ) {
            return {
                apiKey: config.REALM_GRAPHQL_API_KEY,
                authorization: '',
            };
        }

        return {
            apiKey: '',
            authorization: executorRequest?.context.req.headers.authorization!,
        };
    },
});

// TODO: uncomment items after the subscription collection is migrated

const ignoreTypes = [
    'Quickadd',
    'QuickaddQueryInput',
    'QuickaddUpdateInput',
    'QuickaddInsertInput',

    'Classification',
    'ClassificationUpdateInput',
    'ClassificationInsertInput',
    'ClassificationQueryInput',
    'ClassificationIncidentsRelationInput',
    'ClassificationReportsRelationInput',

    'Report',
    'ReportQueryInput',
    'ReportUpdateInput',
    'ReportInsertInput',
    'ReportUserRelationInput',
    'CreateVariantInput',

    // 'Incident',
    // 'IncidentQueryInput',
    'IncidentUpdateInput',
    'IncidentInsertInput',
    'IncidentEditorsRelationInput',
    'IncidentReportsRelationInput',
    'LinkReportsToIncidentsInput',

    'Entity',
    'EntityQueryInput',
    'EntityUpdateInput',
    'EntityInsertInput',

    // 'User',
    // 'UserQueryInput',
    'UserUpdateInput',
    'UserInsertInput',

    'Submission',
    'SubmissionQueryInput',
    'SubmissionUpdateInput',
    'SubmissionInsertInput',
    'SubmissionDeployersRelationInput',
    'SubmissionDevelopersRelationInput',
    'SubmissionHarmed_partiesRelationInput',
    'SubmissionIncident_editorsRelationInput',
    'SubmissionUserRelationInput',
    'PromoteSubmissionToReportPayload',
    'PromoteSubmissionToReportInput',

    'UpdateOneReportTranslationInput',

    'CreateVariantInputVariant',

    'Taxa',
    'TaxaQueryInput',
    'TaxaUpdateInput',
    'TaxaInsertInput',

    'Subscription',
    'SubscriptionQueryInput',
    'SubscriptionUpdateInput',
    'SubscriptionInsertInput',

    'Duplicate',
    'DuplicateQueryInput',
    'DuplicateUpdateInput',
    'DuplicateInsertInput',
];

const ignoredQueries = [
    'quickadd',
    'quickadds',

    'classification',
    'classifications',

    'report',
    'reports',

    'incident',
    'incidents',

    'entity',
    'entities',

    'user',
    'users',

    'submission',
    'submissions',

    'taxa',
    'taxas',

    'subscription',
    'subscriptions',

    'duplicate',
    'duplicates',
];

const ignoredMutations = [
    'deleteOneQuickadds',
    'deleteManyQuickadds',
    'insertOneQuickadd',
    'insertManyQuickadds',
    'updateOneQuickadd',
    'updateManyQuickadds',
    'upsertOneQuickadd',

    'deleteOneClassification',
    'deleteManyClassifications',
    'insertOneClassification',
    'insertManyClassifications',
    'updateOneClassification',
    'updateManyClassifications',
    'upsertOneClassification',

    'deleteOneClassification',
    'deleteManyClassifications',
    'insertOneClassification',
    'insertManyClassifications',
    'updateOneClassification',
    'updateManyClassifications',
    'upsertOneClassification',
    'upsertManyClassifications',

    'deleteOneReport',
    'deleteManyReports',
    'insertOneReport',
    'insertManyReports',
    'updateOneReport',
    'updateManyReports',
    'upsertOneReport',

    'createVariant',

    'linkReportsToIncidents',

    'deleteOneIncident',
    'deleteManyIncidents',
    'insertOneIncident',
    'insertManyIncidents',
    'updateOneIncident',
    'updateManyIncidents',
    'upsertOneIncident',

    'deleteOneEntity',
    'deleteManyEntities',
    'insertOneEntity',
    'insertManyEntities',
    'updateOneEntity',
    'updateManyEntities',
    'upsertOneEntity',

    'deleteOneUser',
    'deleteManyUsers',
    'insertOneUser',
    'insertManyUsers',
    'updateOneUser',
    'updateManyUsers',
    'upsertOneUser',

    'deleteOneSubmission',
    'deleteManySubmissions',
    'insertOneSubmission',
    'insertManySubmissions',
    'updateOneSubmission',
    'updateManySubmissions',
    'upsertOneSubmission',
    'upsertManySubmissions',
    'promoteSubmissionToReport',

    'updateOneReportTranslation',

    'deleteOneTaxa',
    'deleteManyTaxas',
    'insertOneTaxa',
    'insertManyTaxas',
    'updateOneTaxa',
    'updateManyTaxas',
    'upsertOneTaxa',

    'deleteOneSubscription',
    'deleteManySubscriptions',
    'insertOneSubscription',
    'insertManySubscriptions',
    'updateOneSubscription',
    'updateManySubscriptions',
    'upsertOneSubscription',

    'deleteOneDuplicate',
    'deleteManyDuplicates',
    'insertOneDuplicate',
    'insertManyDuplicates',
    'updateOneDuplicate',
    'updateManyDuplicates',
    'upsertOneDuplicate',
]

/**
 * Generates a GraphQL schema by filtering out fields from the remote schema provided by Atlas.
 * This function excludes types and fields that have already been migrated to the local API, ensuring that the schema only includes relevant parts.
 * 
 * The schema is created using `makeExecutableSchema` and includes transformations to filter out unwanted types and fields:
 * - `FilterTypes`: Excludes types listed in `ignoreTypes`.
 * - `FilterObjectFields`: Excludes fields in `Query` and `Mutation` types listed in `ignoredQueries` and`ignoredMutations`.
 * 
 * @returns { Object } - The configured schema object with type definitions and transformations applied.
 */
export const getSchema = () => {

    const schema = {
        schema: makeExecutableSchema({ typeDefs: remoteTypeDefs }),
        executor: userExecutor,
        transforms: [
            new FilterTypes((typeName) => {

                if (ignoreTypes.includes(typeName.name)) {

                    return false;
                }

                return true

            }),
            new FilterObjectFields((typeName, fieldName) => {

                if (typeName === 'Query' && ignoredQueries.includes(fieldName)) {

                    return false;
                }

                if (typeName === 'Mutation' && ignoredMutations.includes(fieldName)) {

                    return false;
                }

                return true
            })
        ],
    }

    return schema;
}