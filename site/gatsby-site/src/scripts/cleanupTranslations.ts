import { MongoClient } from 'mongodb';

const DRY_RUN = process.env.DRY_RUN !== 'false';

const invalidFieldQuery = (fields: string[]) => ({
  $or: fields.flatMap((field) => [
    { [field]: { $exists: false } },
    { [field]: null },
    { [field]: '' },
  ]),
});

(async () => {
  const connectionString = process.env.MONGODB_TRANSLATIONS_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error('MONGODB_TRANSLATIONS_CONNECTION_STRING is required');
  }

  console.log(`Running in ${DRY_RUN ? 'DRY RUN' : 'LIVE'} mode\n`);

  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    const db = client.db('translations');

    // Clean up report translations with empty/null/missing title or text
    const reportQuery = invalidFieldQuery(['title', 'text']);
    const invalidReports = await db.collection('reports').find(reportQuery).toArray();

    console.log(`Found ${invalidReports.length} invalid report translations:`);
    for (const t of invalidReports) {
      console.log(`  report_number: ${t.report_number}, language: ${t.language}, title: ${JSON.stringify(t.title)}, text: ${t.text === undefined ? 'undefined' : t.text === null ? 'null' : `"${t.text.slice(0, 50)}..."`}`);
    }

    if (!DRY_RUN && invalidReports.length > 0) {
      const reportResult = await db.collection('reports').deleteMany(reportQuery);
      console.log(`\nDeleted ${reportResult.deletedCount} invalid report translations`);
    }

    // Clean up incident translations with empty/null/missing title or description
    const incidentQuery = invalidFieldQuery(['title', 'description']);
    const invalidIncidents = await db.collection('incidents').find(incidentQuery).toArray();

    console.log(`\nFound ${invalidIncidents.length} invalid incident translations:`);
    for (const t of invalidIncidents) {
      console.log(`  incident_id: ${t.incident_id}, language: ${t.language}, title: ${JSON.stringify(t.title)}, description: ${t.description === undefined ? 'undefined' : t.description === null ? 'null' : `"${t.description.slice(0, 50)}..."`}`);
    }

    if (!DRY_RUN && invalidIncidents.length > 0) {
      const incidentResult = await db.collection('incidents').deleteMany(incidentQuery);
      console.log(`\nDeleted ${incidentResult.deletedCount} invalid incident translations`);
    }

    if (DRY_RUN && (invalidReports.length > 0 || invalidIncidents.length > 0)) {
      console.log('\nDRY RUN: No documents were deleted. Set DRY_RUN=false to delete.');
    }

    if (invalidReports.length === 0 && invalidIncidents.length === 0) {
      console.log('\nNo invalid translations found.');
    }
  } finally {
    await client.close();
  }
})();
