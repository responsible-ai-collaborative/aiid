// Example query:
//
// query {
//   risks(input: {tags: ["GMF:Known AI Technology:Transformer"]}) {
//     tag	
//     precedents {
//       incident_id
//       title
//     }
//   }
// }
//
// Example response:
//
// { "data": {
//     "risks": [
//       { "tag": "GMF:Known AI Technical Failure:Unsafe Exposure or Access",
//         "precedents": [
//           { "incident_id": 179,
//             "title": "DALL-E 2 Reported for Gender and Racially Biased Outputs"
//           },
//           ...
//         ]
//       },
//       ...
//     ]
// }}
exports = async (input) => {

  const db = context.services.get('mongodb-atlas').db('aiidprod');
  const incidentsCollection = db.collection('incidents');
  const classificationsCollection = db.collection('classifications');

  const classificationsMatchingSearchTags = (
    await classificationsCollection.find(
      getRiskClassificationsMongoQuery(input?.tags),
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
  ).toArray();

  // TODO: These should probably be defined in the taxa
  const failureTags = [
    { namespace: "GMF", short_name: "Known AI Technical Failure"},
    { namespace: "GMF", short_name: "Potential AI Technical Failure" }
  ]

  // TODO: This selects every field.
  // For performance, we should only select those we need.
  const failureClassificationsMatchingIncidentIds = (
    await classificationsCollection.find(
      {
        incidents: {
          $elemMatch: {
            $in: incidentIdsMatchingSearchTags
          }
        },
        $or: failureTags.map(
          failureTag => ({
            namespace: failureTag.namespace,
            "attributes.short_name": failureTag.short_name
          })
        )
      },
    ).toArray()
  )

  const matchingClassificationsByFailure = groupByMultiple(
    failureClassificationsMatchingIncidentIds,
    classification => tagsFromClassification(classification).filter(
      tag => tag.startsWith('GMF:Known AI Technical Failure:') 
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
          return incidents;
        }
      ).flat()
    })
  ).sort((a, b) => b.precedents.length - a.precedents.length);

  return risks;
};

const getRiskClassificationsMongoQuery = (tagStrings) => {

  if (!tagStrings) return {};

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

// Example classification:
// {
//   attributes: [
//     { short_name: "Known AI Goal"},
//       value_json: '["Content Recommendation", "Something"]' }
//     ...
//   ]
// }
const tagsFromClassification = (classification) => (
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

const groupByMultiple = (array, keyFunction, valueFunction) => {
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
