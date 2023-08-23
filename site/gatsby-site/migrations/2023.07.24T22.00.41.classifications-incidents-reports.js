const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */
exports.up = async ({ context: { client } }) => {
  await client.connect();

  const classificationsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  const classifications = classificationsCollection.find({});

  while (await classifications.hasNext()) {
    const classification = await classifications.next();

    const result = await classificationsCollection.updateOne(
      { _id: classification._id },
      {
        $set: { incidents: [classification.incident_id], reports: [] },
        $unset: { incident_id: '' },
      }
    );

    console.log(
      `Updated ${classification.namespace} ${classification.incident_id} : ${result.modifiedCount}`
    );
  }
};
