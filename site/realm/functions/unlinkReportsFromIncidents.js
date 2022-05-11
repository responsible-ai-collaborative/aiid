exports = async (input) => {

  throw 'Orphan reports are not supported yet.'
  
  const incidents = context.services.get('mongodb-atlas').db('aiidprod').collection("incidents");
  
  await incidents.updateMany({incident_id: {$in: input.incident_ids}}, {$pull: {reports: {$in: input.report_numbers} }});
  
  return incidents.find({incident_id: {$in: input.incident_ids }}).toArray();
};