import { MongoClient } from 'mongodb';

import config from '../../../../config';

export default async function handler(req, res) {

  const mongoClient = new MongoClient(config.mongodb.translationsConnectionString);

  const incidentsCollection = mongoClient.db('aiidprod').collection('incidents');
  
  const classificationsCollection = mongoClient.db('aiidprod').collection('classifications');

  const classificationsMatchingSearchTags = await classificationsCollection.find(
    getRiskClassificationsMongoQuery(req.query),
  ).toArray();

  const incidentIdsMatchingSearchTags = classificationsMatchingSearchTags.map(classification => classification.incident_id);

  const incidentsMatchingSearchTags = await incidentsCollection.find(
    {
      incident_id: {
        $in: incidentIdsMatchingSearchTags
      },
    },
    { projection: { incident_id: 1, title: 1, description: 1 }}
  ).toArray();

  res.status(200).json(incidentsMatchingSearchTags);
}

function getRiskClassificationsMongoQuery(queryParams) {

  const searchTagSearch = getTagSearchFromQueryParam(queryParams.searchTags);
  const riskTagSearch   = getTagSearchFromQueryParam(queryParams.riskTags);

  const namespaces = Array.from(new Set(
    Object.keys({ ...searchTagSearch, ...riskTagSearch})
  ));

  return {
    $or: namespaces.map(
      namespace => ({
        namespace,
        attributes: {
          $elemMatch: {
            $and: [
              {$or: searchTagSearch[namespace] || [{}] },
              {$or: riskTagSearch[namespace] || [{}] }
            ]
          }
        }
      })
    )
  }
}

function getTagSearchFromQueryParam(tagsParam) {

  const tagStrings = tagsParam.split('___');

  const tagSearch = {};

  for (const tagString of tagStrings) {
    const parts = tagString.split(":");
    const namespace = parts[0];
    tagSearch[namespace] ||= [];
    const tag = {};
    tag.short_name = parts[1];
    if (parts.length > 2) {
      tag.value_json = {$regex: `"${parts[2]}"`};
    }
    tagSearch[namespace].push(tag);
  }
  return tagSearch;
}

