import { IncomingMessage } from "http";
import { MongoClient } from "mongodb";

function extractToken(header: string) {

    if (header && header!.startsWith('Bearer ')) {

        return header.substring(7);
    }

    return null;
}

async function verifyToken(token: string) {

    const groupId = '623a1e4d5cb41b713d41afb2';

    const appId = '6421f7150933bc38b73a7f49';

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

async function getUser(userId: string) {

    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING!);

    const db = client.db('customData');

    const collection = db.collection('users');

    const userData = await collection.findOne({ userId });

    return {
        id: userId,
        roles: userData?.roles,
    }
}

async function getUserFromHeader(header: string) {

    const token = extractToken(header);

    if (token) {

        const data = await verifyToken(token);

        if (data.sub) {

            const userData = await getUser(data.sub);

            return userData;
        }
    }

    return null;
}

export const context = async ({ req }: { req: IncomingMessage }) => {

    const user = await getUserFromHeader(req.headers.authorization!);

    return { user, req };
}