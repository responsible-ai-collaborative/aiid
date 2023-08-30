exports = async (input) => {
  
  const query = JSON.parse(input.query);
  
  const classifications = context.services.get('mongodb-atlas').db('aiidprod').collection("classifications");
  
  const results = await classifications.find(query, {incidents: 1, reports: 1, namespace: 1}).toArray();
  
  return results;
};
