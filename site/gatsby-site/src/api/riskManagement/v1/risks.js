import { MongoClient } from 'mongodb';

import config from '../../../../config';


const groupable = (array) => {
  array.groupBy = (keyFunction, valueFunction) => {
    const groups = {};
    for (const element of array) {
      const key = keyFunction(element);
      groups[key] ||= [];
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
        groups[key] ||= new Set();
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

export default async function handler(req, res) {


  const mongoClient = new MongoClient(config.mongodb.translationsConnectionString);

  const incidentsCollection = mongoClient.db('aiidprod').collection('incidents');
  
  const classificationsCollection = mongoClient.db('aiidprod').collection('classifications');

  const selectors = [
//    {
//      short_name: "Known AI Technical Failure", 
//      value_json: { $regex: '"Tuning Issues"' }
//    },
//    {
//      short_name: "Known AI Technology", 
//      value_json: { $regex: '"Content-based Filtering"' }
//    },
  ]

  const tagStrings = req.query.tags.split('___');

  const tagsByNamespace = {};

  for (const tagString of tagStrings) {
    const parts = tagString.split(":");
    const namespace = parts[0];
    tagsByNamespace[namespace] ||= [];
    const tag = {};
    tag.short_name = parts[1];
    if (parts.length > 2) {
      tag.value_json = {$regex: `"${parts[2]}"`};
    }
    tagsByNamespace[namespace].push(tag);
  }

  const matchingClassifications = await classificationsCollection.find(
    {
      $or: Object.keys(tagsByNamespace).map(
        namespace => ({
          namespace,
          attributes: {
            $elemMatch: {
              $or: tagsByNamespace[namespace]
            }
          }
        })
      )
    },
    //{ projection: { incident_id: 1 }}
  ).toArray();

  const matchingIncidentIds = matchingClassifications.map(classification => classification.incident_id);

  const classificationsByIncident = groupable(matchingClassifications).groupBy(
    classification => classification.incident_id
  );

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

  const matchingIncidents = await incidentsCollection.find(
    {
      incident_id: {
        $in: matchingIncidentIds
      },
    },
    { projection: { incident_id: 1, title: 1 }}
  ).toArray();

  const matchingIncidentsByIncidentId = groupable(matchingIncidents).groupBy(
    incident => incident.incident_id
  );

  const matchingFailureClassifications = await classificationsCollection.find(
    {
      incident_id: {
        $in: matchingIncidentIds
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
  ).toArray();

  const classificationsByFailure = 
    groupable(matchingFailureClassifications)
      .groupByMultiple(
        classification => classification.attributes.reduce(
          (tags, attribute) => tags.concat(
            JSON.parse(attribute.value_json)
//            .map(
//              tag => [
//                classification.namespace, 
//                attribute.short_name,
//                tag 
//              ].join(':')
//            )
          ), []
        )
      );

  const risks = Object.keys(classificationsByFailure).map(
    failure => {
      const classifications = classificationsByFailure[failure];
      return {
        tag: failure,
        precedents: classifications.map(classification => ({
          ...classification,
          title: matchingIncidentsByIncidentId[classification.incident_id][0].title
        })) /*.map(classification => 
          matchingIncidentsByIncidentId[classifications.incident_id]
        )*/
      }
    }
  ).sort((a, b) => b.precedents.length - a.precedents.length);

/*
  const result = await classificationsCollection.find(
      {
        namespace: "GMF",
        attributes: {
          $elemMatch: {
            $or: [
              ...selectors
            ]
          }
        }
      },
      { projection: { 
          _id: 0,
          incident_id: 1,
          attributes: 1
        }
      }
    ).toArray();


  const result = await incidentsCollection.find(
    { incident_id: 1 

    }, 
    { projection: { 
        incident_id: 1,
        title: 1 
      }
    }
  ).toArray();
*/

  res.status(200).json(risks);
}
