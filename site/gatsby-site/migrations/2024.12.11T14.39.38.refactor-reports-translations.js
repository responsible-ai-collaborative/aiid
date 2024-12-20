/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const db = client.db('translations');

  const reportsEnCollection = db.collection('reports_en');

  const reportsEsCollection = db.collection('reports_es');

  const reportsFrCollection = db.collection('reports_fr');

  const reportsJaCollection = db.collection('reports_ja');

  const reportsCollection = db.collection('reports');

  // Fetch all documents from reports_en, reports_es, reports_fr, and reports_ja
  const reportsEn = await reportsEnCollection.find().toArray();

  const reportsEs = await reportsEsCollection.find().toArray();

  const reportsFr = await reportsFrCollection.find().toArray();

  const reportsJa = await reportsJaCollection.find().toArray();

  // Transform and insert documents into reports with a new field "language"
  const transformedReportsEn = reportsEn.map((report) => ({
    ...report,
    language: 'en',
  }));

  const transformedReportsEs = reportsEs.map((report) => ({
    ...report,
    language: 'es',
  }));

  const transformedReportsFr = reportsFr.map((report) => ({
    ...report,
    language: 'fr',
  }));

  const transformedReportsJa = reportsJa.map((report) => ({
    ...report,
    language: 'ja',
  }));

  // Insert transformed documents into reports
  const resultEn = await reportsCollection.insertMany(transformedReportsEn);

  const resultEs = await reportsCollection.insertMany(transformedReportsEs);

  const resultFr = await reportsCollection.insertMany(transformedReportsFr);

  const resultJa = await reportsCollection.insertMany(transformedReportsJa);

  console.log(
    `${resultEn.insertedCount} documents with language "en" were inserted into the "reports" collection.`
  );
  console.log(
    `${resultEs.insertedCount} documents with language "es" were inserted into the "reports" collection.`
  );
  console.log(
    `${resultFr.insertedCount} documents with language "fr" were inserted into the "reports" collection.`
  );
  console.log(
    `${resultJa.insertedCount} documents with language "ja" were inserted into the "reports" collection.`
  );
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  const db = client.db('translations');

  const reportsCollection = db.collection('reports');

  // Drop the reports collection
  await reportsCollection.drop();
  console.log('Collection "reports" has been dropped.');
};
