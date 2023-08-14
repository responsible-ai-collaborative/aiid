import { MongoClient } from 'mongodb';

import config from '../../../../config';

export default async function handler(req, res) {

  const mongoClient = new MongoClient(
    config.mongodb.translationsConnectionString
  );
  const db = mongoClient.db('aiidprod')
  const incidentsCollection = db.collection('incidents');
  const classificationsCollection = db.collection('classifications');

  const classificationsMatchingSearchTags = (
    await classificationsCollection.find(
      getRiskClassificationsMongoQuery(req.query),
    ).toArray()
  );

  const tagsByIncidentId = {};
  for (const classification of classificationsMatchingSearchTags) {
    const id = classification.incident_id;
    tagsByIncidentId[id] = (
      (tagsByIncidentId[id] || []).concat(
        tagsFromClassification(classification)
      )
    )
  }

  const incidentIdsMatchingSearchTags = (
    classificationsMatchingSearchTags.map(c => c.incident_id)
  );

  const incidentsMatchingSearchTags = await incidentsCollection.find(
    { incident_id: { $in: incidentIdsMatchingSearchTags } },
    { projection: { incident_id: 1, title: 1, description: 1 }}
  ).toArray();

  const failureAttributeQuery = {
    attributes: {
      $elemMatch: { 
        short_name: {
          $in: [
            "Known AI Technical Failure", 
            "Potential AI Technical Failure"
          ]
        }
      }
    }
  };
  const failureClassificationsMatchingIncidentIds = (
    await classificationsCollection.find(
      {
        incident_id: {
          $in: incidentIdsMatchingSearchTags
        },
        ...failureAttributeQuery
      },
      { 
        projection: {
          namespace: 1,
          incident_id: 1,
          ...failureAttributeQuery
        }
      }
    ).toArray()
  );
  
  const matchingClassificationsByFailure = (
    groupable(failureClassificationsMatchingIncidentIds).groupByMultiple(
      classification => tagsFromClassification(classification)
    )
  );

  const risks = Object.keys(matchingClassificationsByFailure).map(
    failure => ({
      tag: failure,
      precedents: matchingClassificationsByFailure[failure].map(
        failureClassification => {
          const incident = incidentsMatchingSearchTags.find(
            incident => incident.incident_id == failureClassification.incident_id
          );
          const incident_id = failureClassification.incident_id;
          return {
            incident_id,
            title: incident?.title,
            description: incident?.description,
            tags: tagsByIncidentId[incident_id]
          }
        }
      )
    })
  ).sort((a, b) => b.precedents.length - a.precedents.length);

  res.status(200).json(risks);

}

function getRiskClassificationsMongoQuery(queryParams) {
  const tagStrings = queryParams.tags.split('___');

  const tagSearch = {};

  for (const tagString of tagStrings) {
    const parts = tagString.split(":");
    const namespace = parts[0];
    if (!tagSearch[namespace]) {
      tagSearch[namespace] = [];
    }
    const tag = {};
    tag.short_name = parts[1];
    if (parts.length > 2) {
      tag.value_json = {$regex: `"${parts[2]}"`};
    }
    tagSearch[namespace].push(tag);
  }

  return {
    $or: Object.keys(tagSearch).map(
      namespace => ({
        namespace,
        attributes: {
          $elemMatch: {
            $or: tagSearch[namespace]
          }
        }
      })
    )
  }
}

var tagsFromClassification = (classification) => (
  // classification:
  // {
  //   attributes: [
  //     { short_name: "Known AI Goal"},
  //       value_json: '["Content Recommendation", "Something"]' }
  //     ...
  //   ]
  // }
  joinArrays(
    classification.attributes.filter(a => ![null, undefined].includes(a.value_json)).map(
      attribute => (
        [].concat(parseJson(attribute.value_json))
          .filter(value => Array.isArray(value) || typeof value !== 'object')
          .map(
            value => [
              classification.namespace,
              attribute.short_name,
              value
            ].join(':')
          )
      )
    )
  )
);

function parseJson(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error('Could not parse ' + json)
  }
}

var joinArrays = (arrays) => arrays.reduce(
  (result, array) => result.concat(array), []
);

var groupable = (array) => {
  array.groupBy = (keyFunction, valueFunction) => {
    const groups = {};
    for (const element of array) {
      const key = keyFunction(element);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(
        valueFunction ? valueFunction(element) : element
      );
    }
    return groups;
  }
  array.groupByMultiple = (keyFunction, valueFunction) => {
    const groups = {};
    for (const element of array) {
      const keys = keyFunction(element);
      for (const key of keys) {
        if (!groups[key]) {
          groups[key] = new Set();
        }
        groups[key].add(
          valueFunction ? valueFunction(element) : element
        );
      }
    }
    for (const group in groups) {
      groups[group] = Array.from(groups[group]);
    }
    return groups;
  }
  return array;
}
