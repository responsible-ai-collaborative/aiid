const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  const updateResult = await reportsCollection.updateMany(
    {
      is_incident_report: true,
      title: { $in: [null, ''] },
      url: { $in: [null, ''] },
      source_domain: { $in: [null, ''] },
    },
    { $set: { is_incident_report: false } }
  );

  console.log('Update result:', updateResult);
};
