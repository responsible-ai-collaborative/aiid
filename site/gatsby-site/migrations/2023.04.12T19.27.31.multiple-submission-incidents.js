const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const collection = client.db(config.realm.production_db.db_name).collection('submissions');

  const cursor = await collection.find({});

  while (await cursor.hasNext()) {
    const submission = await cursor.next();

    collection.updateOne(
      { _id: submission._id },
      {
        $set: { incident_ids: submission.incident_id == 0 ? [] : [submission.incident_id] },
        $unset: { incident_id: '' },
      }
    );
  }
};
