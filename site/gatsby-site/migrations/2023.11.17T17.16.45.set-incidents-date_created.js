const config = require('../config');
/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  // New date_created field on incidents collection
  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  const incidentsCursor = incidentsCollection.find({});

  while (await incidentsCursor.hasNext()) {
    const incident = await incidentsCursor.next();

    const date_created = new Date(incident.date);

    console.log(`Updating incident ${incident._id} with date_created "${date_created}"`);

    await incidentsCollection.updateOne(
      { _id: incident._id },
      {
        $set: {
          date_created: date_created,
        },
      }
    );

    incident.date_created = date_created;
  }
};
