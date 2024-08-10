import { IncomingMessage } from "http";
import { MongoClient } from "mongodb";
import config from "./config";
import * as reporter from "./reporter";

function extractToken(header: string) {
    if (header && header.startsWith('Bearer ')) {
        return header.substring(7);
    }
    return null;
}

export const verifyToken = async (token: string) => {
    const loginResponse = await fetch(
        `https://realm.mongodb.com/api/admin/v3.0/auth/providers/mongodb-cloud/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: config.REALM_API_PUBLIC_KEY,
                apiKey: config.REALM_API_PRIVATE_KEY,
            }),
        }
    );

    if (!loginResponse.ok) {
        throw new Error(`Error logging into admin API! \n\n ${await loginResponse.text()}`);
    }

    const loginData = await loginResponse.json();

    const response = await fetch(
        `https://realm.mongodb.com/api/admin/v3.0/groups/${config.REALM_API_GROUP_ID}/apps/${config.REALM_API_APP_ID}/users/verify_token`,
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
        throw new Error(`Error verifying user token! \n\n ${await response.text()}`);
    }

    return response.json();
}

async function getUser(userId: string, client: MongoClient) {
    const db = client.db('customData');
    const collection = db.collection('users');
    const userData = await collection.findOne({ userId });

    return {
        id: userId,
        roles: userData?.roles,
    };
}

async function getTokenCache(token: string, client: MongoClient) {
    const db = client.db('customData');
    const collection = db.collection('tokenCache');

    return collection.findOne({ token });
}

async function deleteTokenCache(token: string, client: MongoClient) {
    const db = client.db('customData');
    const collection = db.collection('tokenCache');

    await collection.deleteMany({ token });
}

async function setTokenCache(token: string, userId: string, client: MongoClient) {
    const db = client.db('customData');
    const collection = db.collection('tokenCache');

    await collection.deleteMany({ userId });

    await collection.insertOne({ token, userId });
}

async function getUserFromHeader(header: string, client: MongoClient) {
    const token = extractToken(header);

    console.log('checking token', token);

    if (token) {

        const cachedToken = await getTokenCache(token, client);

        let userId = null;

        if (cachedToken) {

            userId = cachedToken.userId;
        }
        else {

            const data = await verifyToken(token);

            if (data === 'token expired') {

                await deleteTokenCache(token, client);

                throw new Error('Token expired');
            }

            if (data.sub) {
                userId = data.sub;
            }
        }

        if (userId) {
            
            const userData = await getUser(userId, client);

            await setTokenCache(token, userId, client);

            return userData;
        }
    }

    return null;
}

export const context = async ({ req, client }: { req: IncomingMessage, client: MongoClient }) => {
    try {
        const user = await getUserFromHeader(req.headers.authorization!, client);
        return { user, req, client };
    } catch (e) {
        reporter.error(e as Error);
        throw e;
    }
};