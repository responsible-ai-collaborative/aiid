const axios = require('axios');

const config = require('../config');

// If set to true, applies migration only 5 randomly selected incidents
// so as to not run up AWS charges
const testing = false;

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  const response = await axios.get(
    'https://raw.githubusercontent.com/' +
      'responsible-ai-collaborative/' +
      'nlp-lambdas/main/inference/db_state/state.csv'
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
      embedding: JSON.stringify(
        arr[2].map(
          // The embedding string is too long to use as a url parameter,
          // so we round to 6 significant digits
          (similarity) => Number(similarity.toFixed(6))
        )
      ),
    }));

  const randomIncidents = [...Array(5)].map(
    () => incidents[Math.floor(Math.random() * incidents.length)]
  );

  for (let incident of testing ? randomIncidents : incidents) {
    const url =
      'https://q3z6vr2qvj.execute-api.us-west-2.amazonaws.com/embed-to-db-similar?num=4&embed=' +
      encodeURIComponent(incident.embedding);

    const lambdaResponse = await axios
      .get(url, { timeout: 30000 })
      .catch((error) => console.error(error));

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
exports.down = async () => {};
