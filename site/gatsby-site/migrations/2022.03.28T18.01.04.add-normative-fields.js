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
      description: report.description,
      'Alleged harmed or nearly harmed parties':
        classification.classifications['Alleged harmed or nearly harmed parties'],
      'Alleged developer of AI system':
        classification.classifications['Alleged developer of AI system'],
      'Alleged deployer of AI system':
        classification.classifications['Alleged deployer of AI system'],
    };

    await incidentsCollection.updateOne(
      { incident_id: classification.incident_id },
      incidentUpdate
    );
  }
};
