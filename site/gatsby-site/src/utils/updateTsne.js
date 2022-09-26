const TSNE = require('tsne-js');

const config = require('../../config');

const { MongoClient } = require('mongodb');

const BSON = require('bson');

const updateTsneInDatabase = async () => {
  const mongo = new MongoClient(config.mongodb.translationsConnectionString);

  await mongo.connect();

  const incidentsCollection = mongo.db(config.realm.production_db.db_name).collection('incidents');

  const incidentsWithEmbeddings = await incidentsCollection
    .find({ embedding: { $exists: true } })
    .toArray();

  const embeddings = incidentsWithEmbeddings.map((incident) => incident?.embedding?.vector);

  const ids = incidentsWithEmbeddings.map((incident) => incident.incident_id);

  const model = new TSNE({
    dim: 2,
    perplexity: 30.0,
    earlyExaggeration: 3.0,
    learningRate: 100.0,
    nIter: 1000,
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
      {
        $set: {
          tsne: {
            x: new BSON.Double(outputScaled[i][0]),
            y: new BSON.Double(outputScaled[i][1]),
          },
        },
      }
    );
  }
};

module.exports = { updateTsneInDatabase };
