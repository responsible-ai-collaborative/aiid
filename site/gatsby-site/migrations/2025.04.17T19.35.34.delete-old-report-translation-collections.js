/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  const db = client.db('translations');

  await db.collection('reports_es').drop();
  console.log(`Collection reports_es deleted successfully`);

  await db.collection('reports_fr').drop();
  console.log(`Collection reports_fr deleted successfully`);

  await db.collection('reports_ja').drop();
  console.log(`Collection reports_ja deleted successfully`);
};
