/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  const subscriptors = [
    'kevin.paeth@ul.org',
    'clara.youdale@dsri.org',
    'pablo.costa@dsri.org',
    'cesar.varela@dsri.org',
    'luna.mcnulty@dsri.org',
  ];

  const authDb = client.db('auth');

  const customDataDb = client.db('customData');

  const authUsersCollection = authDb.collection('users');

  const subscriptionsCollection = customDataDb.collection('subscriptions');

  const users = await authUsersCollection.find({ email: { $in: subscriptors } }).toArray();

  // Remove objectId from users
  const userIds = users.map((user) => user._id.toString());

  // Create a new subscription for each user
  const results = [];

  for (const userId of userIds) {
    const existingSubscription = await subscriptionsCollection.findOne({
      userId: userId,
      type: 'ai-briefing',
    });

    if (!existingSubscription) {
      results.push(
        subscriptionsCollection.insertOne({
          userId: userId,
          type: 'ai-briefing',
          created_at: new Date(),
        })
      );
    }
  }

  await Promise.all(results);

  console.log(`Created ${results.length} ai-briefing subscriptions`);
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
