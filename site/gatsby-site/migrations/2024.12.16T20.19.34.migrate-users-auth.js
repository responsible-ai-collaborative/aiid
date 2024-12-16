const { ObjectId } = require('bson');

const jwt = require('jsonwebtoken');

for (const key of [
  'REALM_API_PUBLIC_KEY',
  'REALM_API_PRIVATE_KEY',
  'REALM_API_GROUP_ID',
  'REALM_API_APP_ID',
]) {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} is required`);
  }
}

let cachedToken = null;

let tokenExpiration = null;

/**
 * Fetches the access token for the MongoDB Atlas Admin API.
 *
 * Note: The token is cached to speed up subsequent requests. Tokens expire after 30 minutes.
 *
 * @returns {Promise<string>} A promise that resolves to the access token.
 */
const getAccessToken = async () => {
  const refreshDate = tokenExpiration ? tokenExpiration * 1000 - 5 * 60 * 1000 : null;

  // Refresh the authentication token well before expiration to avoid interruptions.

  const now = Date.now();

  if (cachedToken && refreshDate && now < refreshDate) {
    return cachedToken;
  }

  const loginResponse = await fetch(
    'https://services.cloud.mongodb.com/api/admin/v3.0/auth/providers/mongodb-cloud/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: process.env.REALM_API_PUBLIC_KEY,
        apiKey: process.env.REALM_API_PRIVATE_KEY,
      }),
    }
  );

  const data = await loginResponse.json();

  if (loginResponse.status != 200) {
    throw new Error(`Login failed: ${data.error}`);
  }

  const decoded = jwt.decode(data.access_token);

  cachedToken = data.access_token;
  tokenExpiration = decoded.exp;

  return cachedToken;
};

const apiRequest = async ({ path, params = {}, method = 'GET' }) => {
  const accessToken = await getAccessToken();

  const url = new URL(
    `https://services.cloud.mongodb.com/api/admin/v3.0/groups/${process.env.REALM_API_GROUP_ID}/apps/${process.env.REALM_API_APP_ID}${path}`
  );

  if (Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);

    url.search = searchParams.toString();
  }

  const headers = { Authorization: `Bearer ${accessToken}` };

  let response = null;

  if (method == 'GET') {
    const result = await fetch(url.toString(), { headers });

    response = await result.json();
  } else {
    throw `Unsupported method ${method}`;
  }

  return response;
};

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */
exports.up = async ({ context: { client } }) => {
  await client.connect();

  const users = await client.db('customData').collection('users').find().toArray();

  for (const user of users) {
    const response = await apiRequest({ path: `/users/${user.userId}` });

    if (response?.data?.email) {
      try {
        await client
          .db('auth')
          .collection('users')
          .insertOne({
            _id: ObjectId.createFromHexString(user.userId),
            email: response?.data?.email,
            emailVerified: new Date(),
          });

        console.log(`Migrated user ${user.userId}`);
      } catch (e) {
        console.error(`Failed to migrate user ${user.userId}: ${e}`);
      }
    } else {
      console.error(`User ${user.userId} not found`);
    }
  }
};
