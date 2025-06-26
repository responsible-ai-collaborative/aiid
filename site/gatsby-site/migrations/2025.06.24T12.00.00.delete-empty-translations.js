/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  const db = client.db('translations');

  const translations = db.collection('reports');

  const result = await translations.deleteMany({
    title: '',
  });

  console.log(`Deleted ${result.deletedCount} empty translations`);
};
