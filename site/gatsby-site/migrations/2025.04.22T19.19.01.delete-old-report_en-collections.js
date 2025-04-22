/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  const db = client.db('translations');

  await db.collection('reports_en').drop();
  console.log(`Collection reports_en deleted successfully`);
};
