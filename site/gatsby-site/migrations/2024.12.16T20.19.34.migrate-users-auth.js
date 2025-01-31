const { ObjectId } = require('bson');

const jwt = require('jsonwebtoken');

const { RateLimiter } = require('limiter');

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

const getDate = (timestamp) => {
  if (timestamp && Number.isInteger(timestamp)) {
    return new Date(timestamp * 1000);
  }

  return new Date();
};

// atlas admin api has a 100 requests per minute limit, so we need to limit the requests
const limiter = new RateLimiter({
  tokensPerInterval: 50,
  interval: 'minute',
});

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */
exports.up = async ({ context: { client } }) => {
  await client.connect();

  const customDataDb = client.db('customData');

  const authDb = client.db('auth');

  const users = await customDataDb.collection('users').find().toArray();

  const migratedUsers = [];

  for (const user of users) {
    await limiter.removeTokens(1);

    const response = await apiRequest({ path: `/users/${user.userId}` });

    if (!response?.data?.email) {
      console.error(`User ${user.userId} not found or missing email`);
      continue;
    }

    // From Atlas documentation and our own testing, we know that users found in the custom_data collection have confirmed their email address and logged in at least once

    migratedUsers.push({
      _id: ObjectId.createFromHexString(user.userId),
      email: response.data.email,
      emailVerified: getDate(response.last_authentication_date),
    });

    console.log(`Fetched user ${user.userId} (${migratedUsers.length}/${users.length})`);
  }

  if (migratedUsers.length > 0) {
    await authDb.collection('users').insertMany(migratedUsers, { ordered: false });
    console.log(`Successfully migrated ${migratedUsers.length} users`);
  } else {
    console.log('No valid users found for migration');
  }
};
