function transformISODateStrings(obj) {
  const newObj = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (typeof value === 'object') {
        newObj[key] = transformISODateStrings(value);
      }
      else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        newObj[key] = new Date(value);
      } else {
        newObj[key] = value;
      }
    }
  }

  return newObj;
}

function convertFacetResults(results) {

  const processed = [];

  for (const result of results) {
    for (const [key, value] of Object.entries(result)) {

      if (value.length == 1 && !("_id" in value[0]) && ('count' in value[0])) {

        processed.push({
          short_name: key,
          count: value[0].count,
        });
      }
      else if (value.length > 0 && value.every(v => ("_id" in v) && ("count" in v))) {

        processed.push({
          short_name: key,
          count: value.reduce((acc, v) => acc + v.count, 0),
          list: value.map(({ _id, count }) => ({ _id, count })).sort((a, b) => a._id.localeCompare(b._id)),
        });
      }
      else {

        processed.push({
          short_name: key,
          count: -1,
        });
      }
    }
  }

  processed.sort((a, b) => a.short_name.localeCompare(b.short_name));

  return processed;
}

function extractNamespaces(obj, namespaces = []) {
  if (Array.isArray(obj)) {
    obj.forEach(item => extractNamespaces(item, namespaces));
  } else if (typeof obj === 'object') {
    if ('namespace' in obj && !namespaces.includes(obj.namespace)) {
      namespaces.push(obj.namespace);
    }
    for (const key in obj) {
      extractNamespaces(obj[key], namespaces);
    }
  }
  return namespaces;
}

function buildFacetsPipeline(taxonomies) {

  const facets = {};

  for (const taxonomy of taxonomies) {

    for (const { short_name, display_type } of taxonomy.field_list) {

      let facet;

      switch (display_type) {

        case "list":
          facet = [
            { $match: { "attributes.short_name": short_name } },
            { $unwind: "$attributes.value" },
            { $group: { _id: "$attributes.value", count: { $sum: 1 } } },
          ]
          break;

        default:

          facet = [
            { $match: { "attributes.short_name": short_name, "attributes.value": { $exists: true } } },
            { $count: "count" },
          ];
      }

      facets[short_name] = facet;
    }
  }

  return facets;
}

exports = async (input) => {

  const classifications = context.services.get('mongodb-atlas').db('aiidprod').collection("classifications");
  const taxa = context.services.get('mongodb-atlas').db('aiidprod').collection("taxa");

  const parsed = JSON.parse(input.query);

  const query = transformISODateStrings(parsed);

  const results = input.query != '{}'
    ? await classifications.find(query, { incidents: 1, reports: 1, namespace: 1 }).toArray()
    : { incidents: [], reports: [] };

  const namespaces = extractNamespaces(query);

  const taxaQuery = namespaces.length > 0 ? { $or: namespaces.map(namespace => ({ namespace })) } : {};

  const taxonomies = await taxa.find(taxaQuery,).toArray();

  const facetsPipeline = buildFacetsPipeline(taxonomies);

  const facetResults = await classifications.aggregate([
    {
      $match: query
    },
    {
      $project: { "attributes.value": 1, "attributes.short_name": 1 }
    },
    {
      $unwind: "$attributes",
    },
    {
      $facet: facetsPipeline,
    },
  ]).toArray();

  const facets = convertFacetResults(facetResults);

  return { results, facets };
};

if (typeof module === 'object') {
  module.exports = exports;
}