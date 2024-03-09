import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema';
import { wrapSchema, FilterTypes, FilterObjectFields, schemaFromExecutor } from '@graphql-tools/wrap';
import { MongoClient } from 'mongodb';
import { ObjectIDResolver, LongResolver } from 'graphql-scalars';
import { readFileSync } from 'fs';
import path from 'path';
import { QuickAdd, Resolvers } from './generated/graphql';
import { buildHTTPExecutor } from '@graphql-tools/executor-http'

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

function extractToken(header: string) {

    if (header && header!.startsWith('Bearer ')) {

        return header.substring(7);
    }

    return null;
}

async function verifyToken(token: string) {

    const groupId = '623a1e4d5cb41b713d41afb2';

    const appId = '6421f7150933bc38b73a7f49';

    console.log('validating token', token);

    try {

        const loginResponse = await fetch(
            `https://realm.mongodb.com/api/admin/v3.0/auth/providers/mongodb-cloud/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: process.env.ATLAS_PUBLIC_KEY,
                    apiKey: process.env.ATLAS_PRIVATE_KEY,
                }),
            }
        );

        const loginData = await loginResponse.json();

        const response = await fetch(
            `https://realm.mongodb.com/api/admin/v3.0/groups/${groupId}/apps/${appId}/users/verify_token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginData.access_token}`
                },
                body: JSON.stringify({ token }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }
    catch (error) {

        console.error('Error:', error);
    }
}


(async () => {

    // local 

    const typeDefs = readFileSync(path.join(__dirname, 'schema.graphql'), { encoding: 'utf-8' });

    const resolvers: Resolvers = {
        ObjectId: ObjectIDResolver,
        Long: LongResolver,
        Query: {
            quickadds: async () => {

                const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING!);

                const db = client.db('aiidprod');
                const collection = db.collection<QuickAdd>('quickadd');
                const items = await collection.find().toArray();

                return items;
            },
        },
    };


    const localSchema = makeExecutableSchema({ typeDefs, resolvers });



    // remote

    const realmSubschema = wrapSchema({
        schema: await schemaFromExecutor(introspectionExecutor),
        executor: userExecutor,
        transforms: [
            new FilterTypes((typeName) => {

                if (typeName.name == 'QuickAdd' || typeName.name == 'QuickaddQueryInput') {

                    return false;
                }

                return true

            }),
            new FilterObjectFields((typeName, fieldName) => {

                if (typeName === 'Query' && fieldName === 'quickadds') {

                    return false;
                }

                return true
            })
        ],
    });


    const gatewaySchema = mergeSchemas({
        schemas: [realmSubschema, localSchema],
    });


    const server = new ApolloServer({
        schema: gatewaySchema,
    });


    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context: async ({ req }) => {

            const token = extractToken(req.headers.authorization!);

            let user = null;

            if (token) {

                const data = await verifyToken(token);

                if (data.sub) {

                    user = {
                        id: data.sub,
                    }
                }
            }

            return { user, req };
        },
    });

    console.log(`🚀  Server ready at: ${url}`);
})();

