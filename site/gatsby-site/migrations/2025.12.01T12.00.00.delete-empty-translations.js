/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  const db = client.db('translations');

  const reportTranslations = db.collection('reports');

  const reportResult = await reportTranslations.deleteMany({
    title: '',
  });

  console.log(`Deleted ${reportResult.deletedCount} report empty translations`);

  const incidentTranslations = db.collection('incidents');

  const incidentResult = await incidentTranslations.deleteMany({
    title: '',
  });

  console.log(`Deleted ${incidentResult.deletedCount} incident empty translations`);
};
