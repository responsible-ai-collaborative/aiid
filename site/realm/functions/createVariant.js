function getUnixTime(dateString) {

  return BSON.Int32(Math.floor(new Date(dateString).getTime() / 1000));
}

function formatDate(date) {
  let month = `${date.getMonth() + 1}`;
  let day = `${date.getDate()}`;
  const year = date.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return `${year}-${month}-${day}`;
}

/**
 * This function creates a new Incident Variant
 * 
 * @param {int} incidentId The Incident ID of the Variant Incident
 * @param {object} variant A JSON object that contains the Variant data
 * 
*/
exports = async (input) => {

  const incidents = context.services.get('mongodb-atlas').db('aiidprod').collection("incidents");
  const reports = context.services.get('mongodb-atlas').db('aiidprod').collection("reports");

  const parentIncident = await incidents.findOne({ incident_id: input.incidentId });

  if (!parentIncident) {
    throw `Incident ${input.incidentId} not found`;
  }

  const report_number = (await reports.find({}).sort({ report_number: -1 }).limit(1).next()).report_number + 1;

  const today = formatDate(new Date(), 'yyyy-MM-dd');

  const newReport = {
    report_number,
    is_incident_report: false,
    title: '',
    date_downloaded: today,
    date_modified: today,
    date_published: today,
    date_submitted: today,
    epoch_date_downloaded: getUnixTime(today),
    epoch_date_modified: getUnixTime(today),
    epoch_date_published: getUnixTime(today),
    epoch_date_submitted: getUnixTime(today),
    image_url: '',
    cloudinary_id: '',
    authors: [],
    submitters: [],
    text: '',
    plain_text: '',
    url: '',
    source_domain: '',
    language: 'en',
    tags: ['variant:unreviewed'],
    text_inputs: input.variant.text_inputs,
    text_outputs: input.variant.text_outputs,
  };

  await reports.insertOne({ ...newReport, report_number: BSON.Int32(newReport.report_number) });

  const incident_ids = [input.incidentId];
  const report_numbers = [newReport.report_number];

  await context.functions.execute('linkReportsToIncidents', { incident_ids, report_numbers });

  return {
    incident_id: input.incidentId,
    report_number,
  }
};

if (typeof module === 'object') {
  module.exports = exports;
}