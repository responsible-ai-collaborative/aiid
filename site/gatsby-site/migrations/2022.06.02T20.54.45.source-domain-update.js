const getSourceDomain = (report) => {
  try {
    const url = new URL(report.url);

    return url.hostname;
  } catch (e) {
    return '';
  }
};

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const reportsCollection = client.db('aiidprod').collection('reports');

  const reportsCursor = await reportsCollection.find(
    { source_domain: { $exists: false } },
    { projection: { url: 1, report_number: 1 } }
  );

  let batch = [];

  const batchSize = 5;

  while (await reportsCursor.hasNext()) {
    const report = await reportsCursor.next();

    const source_domain = getSourceDomain(report);

    const update = {
      updateOne: {
        filter: { report_number: report.report_number },
        update: { $set: { source_domain } },
      },
    };

    batch.push(update);

    console.log(`Updating report ${report.report_number} to ${JSON.stringify(update)}`);

    if (batch.length == batchSize || !(await reportsCursor.hasNext())) {
      await reportsCollection.bulkWrite(batch);

      batch = [];
    }
  }
};
