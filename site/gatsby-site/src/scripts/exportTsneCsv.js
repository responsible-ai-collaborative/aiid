require('dotenv').config();

const config = require('../../config');

const { MongoClient } = require('mongodb');

(async () => {
  const mongoClient = new MongoClient(config.mongodb.translationsConnectionString);

  const aiidprod = mongoClient.db('aiidprod');

  const incidentsCollection = await aiidprod.collection('incidents');

  const classificationsCollection = await aiidprod.collection('classifications');

  const incidents = await incidentsCollection.find({}).toArray();

  for (const incident of incidents) {
    const classifications = await classificationsCollection
      .find({
        incident_id: incident.incident_id,
        namespace: { $in: ['CSET', 'GMF'] },
      })
      .toArray();

    let tags = [];

    for (const classification of classifications) {
      tags.push(tagsFromClassification(classification).join('; '));
    }

    console.log(
      [
        `https://incidentdatabase.ai/cite/${incident.incident_id}`,
        incident.tsne?.x,
        incident.tsne?.y,
        incident.date,
        tags,
        incident.title,
        incident.description,
      ]
        .map((field) => `"${String(field).replace(/"/g, '""')}"`)
        .join(',')
    );
  }

  process.exit(0);
})();

function tagsFromClassification(classification) {
  if (!classification?.attributes) return [];
  return (
    // classification:
    // {
    //   attributes: [
    //     { short_name: "Known AI Goal"},
    //       value_json: '["Content Recommendation", "Something"]' }
    //     ...
    //   ]
    // }
    joinArrays(
      classification.attributes
        .filter((attribute) =>
          [
            'Sector of Deployment',
            'Harm Distribution Basis',
            'Severity',
            'Harm Type',
            'Intent',
            'Near Miss',
            'Problem Nature',
            'System Developer',
            'Known AI Goal',
            'Known AI Technology',
            'Potential AI Technology',
            'Known AI Technical Failure',
            'Potential AI Technical Failure',
          ].includes(attribute.short_name)
        )
        .filter((attribute) => attribute?.value_json)
        .map((attribute) =>
          []
            .concat(JSON.parse(attribute.value_json))
            .filter((value) => Array.isArray(value) || typeof value !== 'object')
            .map((value) => [classification.namespace, attribute.short_name, value].join(':'))
        )
    )
  );
}

function joinArrays(arrays) {
  return arrays.reduce((result, array) => result.concat(array), []);
}
