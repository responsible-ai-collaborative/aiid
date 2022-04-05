const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const csetCollection = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  const csetClassifications = await csetCollection.find({}).toArray();

  for (const classification of csetClassifications) {
    const report = await reportsCollection.findOne({ incident_id: classification.incident_id });

    const incidentUpdate = {
      title: report.title,
      description: classification.classifications['Short Description'],
      'Alleged harmed or nearly harmed parties': [],
      'Alleged developer of AI system': classification.classifications['System Developer'],
      'Alleged deployer of AI system': classification.classifications['System Developer'],
    };

    console.log('Added normative fields to incident: ', classification.incident_id, incidentUpdate);

    await incidentsCollection.updateOne(
      { incident_id: classification.incident_id },
      { $set: { ...incidentUpdate } }
    );
  }
};
