const TSNE = require('tsne-js');

const config = require('../../config');

const { MongoClient, Double } = require('mongodb');

// Scaling every vector to length 1 makes euclidean distance depend only on cosine similarity,
// the measure the similar-incident suggestions use.
const normalise = (binary) => {
  const vector = Array.from(binary.toFloat32Array());

  const magnitude = Math.sqrt(vector.reduce((sum, component) => sum + component * component, 0));

  return magnitude > 0 && Number.isFinite(magnitude)
    ? vector.map((component) => component / magnitude)
    : null;
};

const updateTsneInDatabase = async () => {
  const mongo = new MongoClient(config.mongodb.translationsConnectionString);

  try {
    await mongo.connect();

    const db = mongo.db(config.realm.production_db.db_name);

    const incidentsCollection = db.collection('incidents');

    const incidentIds = new Set(await incidentsCollection.distinct('incident_id'));

    const rows = await db
      .collection('incident_embeddings')
      .find(
        { embedding_schema_version: 2 },
        { projection: { _id: 0, incident_id: 1, dims: 1, 'overview.vector': 1 } }
      )
      .toArray();

    // While a new model is being rolled out, two vector sizes can coexist; plot the larger group.
    const counts = {};

    for (const row of rows) counts[row.dims] = (counts[row.dims] || 0) + 1;

    const dims = Number(Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0]);

    const incidents = rows
      .filter(
        (row) => row.dims === dims && incidentIds.has(row.incident_id) && row.overview?.vector
      )
      .map((row) => ({ incident_id: row.incident_id, vector: normalise(row.overview.vector) }))
      .filter((incident) => incident.vector);

    if (incidents.length < 2) return;

    const model = new TSNE({
      dim: 2,
      perplexity: 30.0,
      earlyExaggeration: 3.0,
      learningRate: 100.0,
      nIter: process.env.TSNE_NITER || 1000,
      metric: 'euclidean',
    });

    model.init({ data: incidents.map((incident) => incident.vector), type: 'dense' });

    model.run();

    // `outputScaled` is `output` scaled to a range of [-1, 1]
    const outputScaled = model.getOutputScaled();

    await incidentsCollection.bulkWrite(
      incidents.map((incident, i) => ({
        updateOne: {
          filter: { incident_id: incident.incident_id },
          update: {
            $set: {
              tsne: { x: new Double(outputScaled[i][0]), y: new Double(outputScaled[i][1]) },
            },
          },
        },
      }))
    );
  } finally {
    await mongo.close();
  }
};

module.exports = { updateTsneInDatabase };
