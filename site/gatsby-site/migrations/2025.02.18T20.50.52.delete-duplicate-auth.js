/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  await client.connect();

  const { ObjectId } = require('mongodb');

  const authDb = client.db('auth');

  const customDataDb = client.db('customData');

  // Get the list of user IDs to delete
  const userIdsToDelete = [
    '669913cbd94a3e8a91dea333',
    '632a0c33ebcf864e7983520c',
    '632a0bd2717bef09c21ea385',
  ];

  // Delete from auth.users collection
  const authDeleteResult = await authDb.collection('users').deleteMany({
    _id: {
      $in: userIdsToDelete.map((id) => new ObjectId(id)),
    },
  });

  console.log(`Successfully deleted ${authDeleteResult.deletedCount} users from auth.users`);

  // Delete from customData.users collection using userId field
  const customDataDeleteResult = await customDataDb.collection('users').deleteMany({
    userId: {
      $in: userIdsToDelete,
    },
  });

  console.log(
    `Successfully deleted ${customDataDeleteResult.deletedCount} users from customData.users`
  );
};
