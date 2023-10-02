import { MongoClient } from 'mongodb';

import config from '../../../../config';

const handler = async (req, res) => {

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
    for (const id of classification.incidents) {
      tagsByIncidentId[id] = (
        (tagsByIncidentId[id] || []).concat(
          tagsFromClassification(classification)
        )
      );
    }
  }

  const incidentIdsMatchingSearchTags = (
    classificationsMatchingSearchTags.map(c => c.incidents).flat()
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
        incidents: {
          $elemMatch: {
            $in: incidentIdsMatchingSearchTags
          }
        },
        ...failureAttributeQuery
      },
      { 
        projection: {
          namespace: 1,
          incidents: 1,
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
      api_message: "This is an experimental an unsupported API",
      tag: failure,
      precedents: matchingClassificationsByFailure[failure].map(
        failureClassification => {
          const incidents = incidentsMatchingSearchTags.filter(
            incident => failureClassification.incidents.includes(incident.incident_id)
          );
          return incidents.map(incident => ({
            incident_id: incident?.incident_id,
            title: incident?.title,
            description: incident?.description,
            tags: tagsByIncidentId[incident?.incident_id]
          }));
        }
      ).flat()
    })
  ).sort((a, b) => b.precedents.length - a.precedents.length);

  res.status(200).json(risks);

}

const getRiskClassificationsMongoQuery = (queryParams) => {
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

const tagsFromClassification = (classification) => (
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

const parseJson = (json) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error('Could not parse ' + json)
  }
}

const joinArrays = (arrays) => arrays.reduce(
  (result, array) => result.concat(array), []
);

const groupable = (array) => {
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

export default handler;

