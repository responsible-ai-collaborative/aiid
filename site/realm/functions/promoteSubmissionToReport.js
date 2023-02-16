function getUnixTime(dateString) {

  return BSON.Int32(Math.floor(new Date(dateString).getTime() / 1000));
}

exports = async (input) => {
  
  const submissions = context.services.get('mongodb-atlas').db('aiidprod').collection("submissions");
  const incidents = context.services.get('mongodb-atlas').db('aiidprod').collection("incidents");
  const reports = context.services.get('mongodb-atlas').db('aiidprod').collection("reports");
  
  const {_id: undefined, ...submission} = await submissions.findOne({_id: input.submission_id});
  
  const parentIncidents = await incidents.find({incident_id: {$in: input.incident_ids }}).toArray();
  
  const report_number = (await reports.find({}).sort({report_number: -1}).limit(1).next()).report_number + 1;

  if(input.is_incident_report) {

    if (parentIncidents.length == 0) {
      
      const lastIncident = await incidents.find({}).sort({incident_id: -1}).limit(1).next();
      
      const newIncident = {
        title: submission.incident_title || submission.title,
        description: submission.description,
        incident_id: lastIncident.incident_id + 1,
        reports: [],
        editors: submission.incident_editors || ["Sean McGregor"],
        date: submission.incident_date,
        "Alleged deployer of AI system": submission.deployers || [],
        "Alleged developer of AI system": submission.developers || [],
        "Alleged harmed or nearly harmed parties": submission.harmed_parties || [],
        nlp_similar_incidents: submission.nlp_similar_incidents || [],
        editor_similar_incidents: submission.editor_similar_incidents || [],
        editor_dissimilar_incidents: submission.editor_dissimilar_incidents || [],
      }
      if (submission.embedding) {
        newIncident.embedding = { 
          vector: submission.embedding.vector,
          from_reports: [BSON.Int32(report_number)] 
        } 
      }
      
      await incidents.insertOne({...newIncident, incident_id: BSON.Int32(newIncident.incident_id)});
      
      parentIncidents.push(newIncident);
  
    } else if (submission.embedding) {
  
      for (const parentIncident of parentIncidents) {
        
        const matchingReports = [];
  
        for (const report_number of parentIncident.reports) {
          matchingReports.push(await reports.findOne({report_number}));
        }
  
        const embeddings = matchingReports
          .map(report => report.embedding)
          .filter(e => e != null)
          .concat([submission.embedding]);
  
        const embedding = {
          vector: 
            embeddings.map(e => e.vector).reduce(
              (sum, vector) => (
                vector.map(
                  (component, i) => component + sum[i]
                )
              ), 
              Array(embeddings[0].vector.length).fill(0)
            ).map(component => component / embeddings.length),
  
          from_reports: 
            matchingReports
              .map(report => BSON.Int32(report.report_number))
              .concat([BSON.Int32(report_number)])
        };
  
        await incidents.updateOne(
          { incident_id: BSON.Int32(parentIncident.incident_id) },
          { $set : { ...parentIncident, embedding }}
        );
      }
    }
  }
  
  const newReport = {
    report_number,
    is_incident_report: input.is_incident_report,
    title: submission.title,
    date_downloaded: submission.date_downloaded,
    date_modified: submission.date_modified,
    date_published: submission.date_published,
    date_submitted: submission.date_submitted,
    epoch_date_downloaded: getUnixTime(submission.date_downloaded),
    epoch_date_modified: getUnixTime(submission.date_modified),
    epoch_date_published: getUnixTime(submission.date_published),
    epoch_date_submitted: getUnixTime(submission.date_submitted),
    image_url: submission.image_url,
    cloudinary_id: submission.cloudinary_id,
    authors: submission.authors,
    submitters: submission.submitters,
    text: submission.text,
    plain_text: submission.plain_text,
    url: submission.url,
    source_domain: submission.source_domain,
    language: submission.language,
    tags: submission.tags,
  };
  if (submission.embedding) {
    newReport.embedding = submission.embedding;
  }
  
  await reports.insertOne({...newReport, report_number: BSON.Int32(newReport.report_number)});

  const incident_ids = parentIncidents.map(incident => incident.incident_id);
  const report_numbers = [ newReport.report_number];
  
  await context.functions.execute('linkReportsToIncidents', {incident_ids, report_numbers });
  

  await submissions.deleteOne({_id: input.submission_id});
  
  return {
    incident_ids,
    report_number,
  }
};

if (typeof module === 'object') {
  module.exports = exports;
}
