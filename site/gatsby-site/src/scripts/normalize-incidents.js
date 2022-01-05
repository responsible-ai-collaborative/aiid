/**
 * Migrates incidents from the old format to the new normalized format.
 * Run with `node ./src/scripts/normalize-incidents.js`
 */

require('dotenv').config();

const lodash = require('lodash');

const MongoClient = require('mongodb').MongoClient;

const config = require('../../config');

const client = new MongoClient(config.mongodb.translationsConnectionString);

const reportFields = [
  '_id',
  'incident_id',
  'ref_number',
  'report_number',

  'date_downloaded',
  'date_submitted',
  'date_modified',
  'date_published',
  'epoch_incident_date',
  'epoch_date_downloaded',
  'epoch_date_submitted',
  'epoch_date_modified',
  'epoch_date_published',

  'submitters',
  'authors',

  'title',
  'description',
  'text',

  'language',
  'image_url',
  'source_domain',
  'url',
];

(async () => {
  await client.connect();

  const incidents = client.db('aiidprod').collection(`incidents`);

  const incidentReports = client.db('aiidprod').collection(`incident_reports`);

  const allIncidentReports = await incidents.find({}).toArray();

  const projectedIncidentReports = allIncidentReports.map((incident) =>
    lodash.pick(incident, reportFields)
  );

  const result = await incidentReports.insertMany(projectedIncidentReports);

  console.log('Inserted', result.insertedCount, 'reports');

  process.exit(0);
})();
