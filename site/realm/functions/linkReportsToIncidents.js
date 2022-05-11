exports = async (input) => {
  
  const incidents = context.services.get('mongodb-atlas').db('aiidprod').collection("incidents");
  
  await incidents.updateMany({incident_id: {$in: input.incident_ids}}, { $addToSet: { reports: { $each: input.report_numbers.map(BSON.Int32) } }});
  
  return incidents.find({incident_id: {$in:  input.incident_ids }}).toArray();
};