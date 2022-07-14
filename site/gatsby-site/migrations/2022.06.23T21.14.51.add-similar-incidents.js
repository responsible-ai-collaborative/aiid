const axios = require('axios');

const config = require('../config');

// If set to true, applies migration only 5 incidents
// so as to not run up AWS charges
const testing = false;

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  const response = await axios.get(
    'https://raw.githubusercontent.com/' +
      'responsible-ai-collaborative/nlp-lambdas/' +
      '1d38974c51629aa7dffdefd5486988cd115100cf/' +
      'inference/db_state/state.csv'
  );

  const incidents = response.data
    .replace(/"/g, '')
    .split('\n')
    .slice(1)
    .filter((line) => line.length > 1)
    .map((line) => JSON.parse('[' + line + ']'))
    .map((arr) => ({
      incident_id: arr[0],
      reports_count: arr[1],
      embedding: JSON.stringify(arr[2]),
    }));

  const testingIncidents = incidents.filter((incident) =>
    [9, 48, 16, 55, 11].includes(incident.incident_id)
  );

  for (let incident of testing ? testingIncidents : incidents) {
    const url = 'https://q3z6vr2qvj.execute-api.us-west-2.amazonaws.com/embed-to-db-similar';

    const lambdaResponse = await axios.post(url, {
      embed: incident.embedding,
      num: 4,
    });

    const similar_incidents = JSON.parse(
      lambdaResponse.data.body.msg.replace(/\(/g, '[').replace(/\)/g, ']')
    )
      .map((arr) => ({ incident_id: arr[1], similarity: arr[0] }))
      .filter((similar_incident) => similar_incident.incident_id != incident.incident_id);

    console.log(
      `Generated similar incidents to incident #${incident.incident_id}`,
      similar_incidents
    );

    await incidentsCollection.updateOne(
      { incident_id: incident.incident_id },
      { $set: { nlp_similar_incidents: similar_incidents } }
    );
  }
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  await incidentsCollection.updateMany(
    { nlp_similar_incidents: { $exists: true } },
    { $set: { nlp_similar_incidents: [] } }
  );
};
