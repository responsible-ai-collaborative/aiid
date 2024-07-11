import { buildHTTPExecutor, HeadersConfig } from '@graphql-tools/executor-http'
import { makeExecutableSchema } from '@graphql-tools/schema';
import { FilterObjectFields, FilterTypes, wrapSchema } from '@graphql-tools/wrap';
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


const ignoreTypes = [
    'Quickadd',
    'QuickaddQueryInput',
];

const ignoredQueries = [
    'quickadd',
    'quickadds',
];

const ignoredMutations = [
    'deleteOneQuickadds',
    'deleteManyQuickadds',
    'insertOneQuickadd',
    'insertManyQuickadds',
    'updateOneQuickadd',
    'updateManyQuickadds',
]

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