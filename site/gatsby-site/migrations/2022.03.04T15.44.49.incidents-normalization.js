const lodash = require('lodash');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const incidentsCollection = client.db('aiidprod').collection('incidents');

  const reportsCollection = client.db('aiidprod').collection('reports');

  const incidents = await incidentsCollection.find({}).toArray();

  const incidentReportGroups = lodash.groupBy(incidents, 'incident_id');

  for (const key in incidentReportGroups) {
    const group = incidentReportGroups[key];

    const { incident_date } = group[0];

    const incidentId = parseInt(key);

    const reportIds = group.map((r) => r.report_number);

    const newIncident = { incident_id: incidentId, date: incident_date, reports: reportIds };

    console.log('delete old incidents with id:', { incident_id: incidentId });
    await incidentsCollection.deleteMany({ incident_id: incidentId });

    console.log(`new incident`, newIncident);
    await incidentsCollection.insertOne(newIncident);

    const reports = [];

    for (const report of group) {
      const {
        _id,
        incident_id,
        cloudinary_id,
        authors,
        date_downloaded,
        date_modified,
        date_published,
        date_submitted,
        description,
        epoch_date_downloaded,
        epoch_date_modified,
        epoch_date_published,
        epoch_date_submitted,
        epoch_incident_date,
        image_url,
        language,
        ref_number,
        report_number,
        source_domain,
        submitters,
        text,
        title,
        url,
        tags,
        flag,
      } = report;

      const newReport = {
        _id,
        incident_id,
        authors: authors || [],
        date_downloaded,
        date_modified,
        date_published,
        date_submitted,
        description,
        epoch_date_downloaded,
        epoch_date_modified,
        epoch_date_published,
        epoch_date_submitted,
        epoch_incident_date,
        image_url,
        language,
        ref_number,
        report_number,
        source_domain,
        submitters: submitters || [],
        text,
        title,
        url,
        tags: tags || [],
      };

      if (flag) {
        newReport.flag = flag;
      }

      if (cloudinary_id) {
        newReport.cloudinary_id = cloudinary_id;
      }

      console.log('new report', { incident_id, report_number });
      reports.push(newReport);
    }

    await reportsCollection.insertMany(reports);
  }
};
