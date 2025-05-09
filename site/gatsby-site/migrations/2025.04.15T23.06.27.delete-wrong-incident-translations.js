/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  const db = client.db('translations');

  console.log('Deleting incidents translations');

  const translations = db.collection('incidents');

  const result = await translations.deleteMany({});

  console.log(`Deleted ${result.deletedCount} incidents translations`);
};
