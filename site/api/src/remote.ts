import { buildHTTPExecutor } from '@graphql-tools/executor-http'
import { FilterObjectFields, FilterTypes, schemaFromExecutor, wrapSchema } from '@graphql-tools/wrap';

const introspectionExecutor = buildHTTPExecutor({
    endpoint: `https://realm.mongodb.com/api/client/v2.0/app/${process.env.REALM_APP_ID}/graphql`,
    headers: {
        apiKey: process.env.REALM_GRAPHQL_API_KEY!,
    },
});

const userExecutor = buildHTTPExecutor({
    endpoint: `https://realm.mongodb.com/api/client/v2.0/app/${process.env.REALM_APP_ID}/graphql`,
    headers(executorRequest) {
        return {
            authorization: executorRequest?.context.req.headers.authorization!,
        }
    },
});


const ignoreTypes = ['QuickAdd', 'QuickaddQueryInput'];

const ignoredQueries = ['quickadds'];


export const getSchema = async () => {

    const schema = wrapSchema({
        schema: await schemaFromExecutor(introspectionExecutor),
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

                return true
            })
        ],
    });

    return schema;
}