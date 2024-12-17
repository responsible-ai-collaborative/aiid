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

  // Drop the original collections
  await reportsEnCollection.drop();
  console.log('Collection "reports_en" has been dropped.');

  await reportsEsCollection.drop();
  console.log('Collection "reports_es" has been dropped.');

  await reportsFrCollection.drop();
  console.log('Collection "reports_fr" has been dropped.');

  await reportsJaCollection.drop();
  console.log('Collection "reports_ja" has been dropped.');
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  const db = client.db('translations');

  // Create collections if they don't exist
  await db.createCollection('reports_en');
  await db.createCollection('reports_es');
  await db.createCollection('reports_fr');
  await db.createCollection('reports_ja');

  const reportsCollection = db.collection('reports');

  const reportsEnCollection = db.collection('reports_en');

  const reportsEsCollection = db.collection('reports_es');

  const reportsFrCollection = db.collection('reports_fr');

  const reportsJaCollection = db.collection('reports_ja');

  // Restore documents to their original collections
  const reportsEn = await reportsCollection.find({ language: 'en' }).toArray();

  const reportsEs = await reportsCollection.find({ language: 'es' }).toArray();

  const reportsFr = await reportsCollection.find({ language: 'fr' }).toArray();

  const reportsJa = await reportsCollection.find({ language: 'ja' }).toArray();

  if (reportsEn.length > 0) {
    // eslint-disable-next-line no-unused-vars
    await reportsEnCollection.insertMany(reportsEn.map(({ language, ...rest }) => rest));
  }
  console.log(
    `${reportsEn.length} documents with language "en" were restored to the "reports_en" collection.`
  );

  if (reportsEs.length > 0) {
    // eslint-disable-next-line no-unused-vars
    await reportsEsCollection.insertMany(reportsEs.map(({ language, ...rest }) => rest));
  }
  console.log(
    `${reportsEs.length} documents with language "es" were restored to the "reports_es" collection.`
  );

  if (reportsFr.length > 0) {
    // eslint-disable-next-line no-unused-vars
    await reportsFrCollection.insertMany(reportsFr.map(({ language, ...rest }) => rest));
  }
  console.log(
    `${reportsFr.length} documents with language "fr" were restored to the "reports_fr" collection.`
  );

  if (reportsJa.length > 0) {
    // eslint-disable-next-line no-unused-vars
    await reportsJaCollection.insertMany(reportsJa.map(({ language, ...rest }) => rest));
  }
  console.log(
    `${reportsJa.length} documents with language "ja" were restored to the "reports_ja" collection.`
  );

  // Remove documents with language "en", "es", "fr", and "ja" from reports
  const resultEn = await reportsCollection.deleteMany({ language: 'en' });

  const resultEs = await reportsCollection.deleteMany({ language: 'es' });

  const resultFr = await reportsCollection.deleteMany({ language: 'fr' });

  const resultJa = await reportsCollection.deleteMany({ language: 'ja' });

  console.log(
    `${resultEn.deletedCount} documents with language "en" were removed from the "reports" collection.`
  );
  console.log(
    `${resultEs.deletedCount} documents with language "es" were removed from the "reports" collection.`
  );
  console.log(
    `${resultFr.deletedCount} documents with language "fr" were removed from the "reports" collection.`
  );
  console.log(
    `${resultJa.deletedCount} documents with language "ja" were removed from the "reports" collection.`
  );

  // Drop the reports collection
  await reportsCollection.drop();
  console.log('Collection "reports" has been dropped.');
};
