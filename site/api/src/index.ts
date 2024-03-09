import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { mergeSchemas } from '@graphql-tools/schema';
import { MongoClient } from 'mongodb';
import { getSchema as getLocalSchema } from './local';
import { getSchema as getRemoteSchema } from './remote';


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

    const localSchema = await getLocalSchema();

    const remoteSchema = await getRemoteSchema();

    
    const gatewaySchema = mergeSchemas({
        schemas: [remoteSchema, localSchema],
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

                    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING!);

                    const db = client.db('customData');

                    const collection = db.collection('users');

                    const userData = await collection.findOne({ userId: data.sub });

                    user = {
                        id: data.sub,
                        roles: userData?.roles,
                    }
                }
            }

            return { user, req };
        },
    });

    console.log(`🚀  Server ready at: ${url}`);
})();

