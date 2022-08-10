const TSNE = require('tsne-js');

const config = require('../../config');

const { MongoClient } = require('mongodb');

const updateTsneInDatabase = async () => {
  const mongo = new MongoClient(config.mongodb.translationsConnectionString);

  await mongo.connect();

  const incidentsCollection = mongo.db(config.realm.production_db.db_name).collection('incidents');

  const incidentsWithEmbeddings = await incidentsCollection
    .find({ embedding: { $exists: true } })
    .toArray();

  console.log(incidentsWithEmbeddings);

  const embeddings = incidentsWithEmbeddings.map((incident) => incident?.embedding?.vector);

  const ids = incidentsWithEmbeddings.map((incident) => incident.incident_id);

  const model = new TSNE({
    dim: 2,
    perplexity: 30.0,
    earlyExaggeration: 3.0,
    learningRate: 100.0,
    nIter: 10000,
    metric: 'euclidean',
  });

  // inputData is a nested array which can be converted into an ndarray
  // alternatively, it can be an array of coordinates (second argument should be specified as 'sparse')
  model.init({ data: embeddings, type: 'dense' });

  // `error`,  `iter`: final error and iteration number
  // note: computation-heavy action happens here
  const [err, iter] = model.run();

  if (err) {
    console.error(err, iter);
  }

  // `outputScaled` is `output` scaled to a range of [-1, 1]
  const outputScaled = model.getOutputScaled();

  for (let i = 0; i < outputScaled.length; i++) {
    incidentsCollection.updateOne(
      { incident_id: ids[i] },
      { $set: { tsne: { x: outputScaled[i][0], y: outputScaled[i][1] } } }
    );
  }
};

const getSpatialIncidents = async () => {
  const mongo = new MongoClient(config.mongodb.translationsConnectionString);

  await mongo.connect();

  const incidentsCollection = mongo.db(config.realm.production_db.db_name).collection('incidents');

  const incidents = await incidentsCollection.find({ tsne: { $exists: true } }).toArray();

  return incidents.map((incident) => {
    const spatialIncident = {
      incident_id: incident.incident_id,
      x: incident.tsne.x,
      y: incident.tsne.y,
      classifications: [] /* ((c) => {
        if (!c) return null;
        let classificationsSubset = {};

        for (let axis of [
          'Harm_Distribution_Basis',
          'System_Developer',
          'Problem_Nature',
          'Sector_of_Deployment',
          'Harm_Type',
          'Intent',
          'Near_Miss',
          'Severity',
        ]) {
          classificationsSubset[c.namespace + ':' + axis] = c.classifications[axis];
        }
        return classificationsSubset;
      })(allClassifications.find((c) => c.incident_id == ids[i])),
      */,
    };

    return spatialIncident;
  });
};

module.exports = { getSpatialIncidents, updateTsneInDatabase };
