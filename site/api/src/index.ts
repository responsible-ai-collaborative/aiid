import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema';
import { wrapSchema, FilterRootFields, FilterTypes, FilterObjectFields, schemaFromExecutor } from '@graphql-tools/wrap';
import { print } from 'graphql';
import { MongoClient } from 'mongodb';

async function realmExecutor({ document, variables }: { document: any; variables?: any }) {
    const query = print(document);

    const fetchResult = await fetch(
        `https://realm.mongodb.com/api/client/v2.0/app/${process.env.REALM_APP_ID}/graphql`,
        {
            method: 'POST',
            headers: {
                apiKey: process.env.REALM_GRAPHQL_API_KEY!,
            },
            body: JSON.stringify({ query, variables }),
        }
    );

    return fetchResult.json();
}


(async () => {

    const typeDefs = `

        type QuickAdd {
            # _id: ObjectId
            date_submitted: String!
            # incident_id: Long
            source_domain: String
            url: String!
        }

        type Query {
            quickadds: [QuickAdd]
        }
    `;

    const resolvers = {
        Query: {
            quickadds: async () => {

                const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING!);

                const db = client.db('aiidprod');
                const collection = db.collection('quickadd');
                const items = await collection.find().toArray();

                return items;
            },
        },
    };


    const localSchema = makeExecutableSchema({ typeDefs, resolvers });


    const realmSubschema = wrapSchema({
        schema: await schemaFromExecutor(realmExecutor),
        executor: realmExecutor,
        transforms: [
            new FilterTypes((typeName) => {

                if (typeName.name == 'QuickAdd') {

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
    });

    console.log(`🚀  Server ready at: ${url}`);
})();

