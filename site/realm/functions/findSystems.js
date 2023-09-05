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

exports = async (input) => {

  const parsed = JSON.parse(input.query);

  const query = transformISODateStrings(parsed);

  const classifications = context.services.get('mongodb-atlas').db('aiidprod').collection("classifications");

  const results = await classifications.find(query, { incidents: 1, reports: 1, namespace: 1 }).toArray();

  return { results };
};

if (typeof module === 'object') {
  module.exports = exports;
}