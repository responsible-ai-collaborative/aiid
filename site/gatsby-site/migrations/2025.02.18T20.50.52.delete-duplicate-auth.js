/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  await client.connect();

  const authDb = client.db('auth');

  await authDb.collection('users').deleteMany({
    _id: {
      $in: [
        { $oid: '669913cbd94a3e8a91dea333' },
        { $oid: '632a0c33ebcf864e7983520c' },
        { $oid: '632a0bd2717bef09c21ea385' },
      ],
    },
  });

  console.log('Successfully deleted specified users');
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {
  // Deleting users is not easily reversible, so the down function is intentionally empty.
  // If rollback is necessary, you would need to manually re-create the deleted users or restore from a database backup.
};
