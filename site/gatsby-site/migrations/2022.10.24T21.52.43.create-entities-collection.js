const config = require('../config');

const { default: slugify } = require('slugify');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const entitiesCollection = await client
    .db(config.realm.production_db.db_name)
    .createCollection('entities');

  entitiesCollection.createIndex({ entity_id: -1 }, { name: 'entity_id_idx', unique: true });

  // Update Incidents
  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  const incidents = await incidentsCollection.find({}).toArray();

  const entityFields = [
    'Alleged deployer of AI system',
    'Alleged developer of AI system',
    'Alleged harmed or nearly harmed parties',
  ];

  const entitiesHash = {};

  for (const incident of incidents) {
    const incidentUpdate = {};

    for (const field of entityFields) {
      incidentUpdate[field] = [];

      for (const entityName of incident[field]) {
        const entityId = slugify(entityName, { lower: true });

        incidentUpdate[field].push(entityId);

        if (!entitiesHash[entityId]) {
          entitiesHash[entityId] = {
            entity_id: entityId,
            name: entityName.trim(),
          };
        }
      }
    }

    console.log(`Update incident ${incident.incident_id} entities:`, incidentUpdate);

    await incidentsCollection.updateOne({ _id: incident._id }, { $set: { ...incidentUpdate } });
  }

  // Update Submissions
  const submissionsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('submissions');

  const submissions = await submissionsCollection.find({}).toArray();

  const submissionFields = ['deployers', 'developers', 'harmed_parties'];

  for (const submission of submissions) {
    const submissionUpdate = {};

    for (const field of submissionFields) {
      if (submission[field] && submission[field].length > 0) {
        submissionUpdate[field] = [];

        for (const entityName of submission[field]) {
          const entityId = slugify(entityName, { lower: true });

          submissionUpdate[field].push(entityId);

          if (!entitiesHash[entityId]) {
            entitiesHash[entityId] = {
              entity_id: entityId,
              name: entityName.trim(),
            };
          }
        }
      }
    }

    if (Object.keys(submissionUpdate).length > 0) {
      console.log(`Update submission ${submission._id} entities:`, submissionUpdate);

      await submissionsCollection.updateOne(
        { _id: submission._id },
        { $set: { ...submissionUpdate } }
      );
    }
  }

  // Insert Entities
  for (const id of Object.keys(entitiesHash)) {
    console.log(`Insert Entity: "${id}"`);

    await entitiesCollection.insertOne(entitiesHash[id]);
  }
};

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.down = async ({ context: { client } }) => {
  await client.connect();

  try {
    await client.db(config.realm.production_db.db_name).dropCollection('entities');
  } catch (e) {
    console.log(e.message);
  }
};
