exports = async (input) => {
  
  const submissions = context.services.get('mongodb-atlas').db('aiidprod').collection("submissions");
  const incidents = context.services.get('mongodb-atlas').db('aiidprod').collection("incidents");
  const reports = context.services.get('mongodb-atlas').db('aiidprod').collection("reports");
  
  
  const {_id: undefined, ...submission} = await submissions.findOne({_id: input.submission_id});
  const lastReport = await reports.find({}).sort({report_number: -1}).limit(1).next();
  
  const newReport = {
    title: submission.title,
    report_number: lastReport.report_number + 1,
  };
  
  await reports.insertOne({...newReport, report_number: BSON.Int32(newReport.report_number)});
  
  
  const parentIncidents = await incidents.find({incident_id: {$in: input.incident_ids }}).toArray();
  
  if(parentIncidents.length == 0) {
    
    const lastIncident = await incidents.find({}).sort({incident_id: -1}).limit(1).next();
    
    const newIncident = {
      title: submission.title,
      incident_id: lastIncident.incident_id + 1,
    }
    
    await incidents.insertOne({...newIncident, incident_id: BSON.Int32(newIncident.incident_id)});
    
    parentIncidents.push(newIncident);
  }
  

  const incident_ids = parentIncidents.map(incident => incident.incident_id);
  const report_numbers = [ newReport.report_number];
  
  await context.functions.execute('linkReportsToIncidents', {incident_ids, report_numbers });
  
  
  await submissions.deleteOne({id: input.submission_id});
  
  
  return incidents.find({incident_id: {$in: incident_ids }}).toArray();
};