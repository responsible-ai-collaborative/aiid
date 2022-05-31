/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const reportsCollection = client.db('aiidprod').collection('reports');

  const cursor = await reportsCollection.find({}, { projection: { text: 1, report_number: 1 } });

  while (await cursor.hasNext()) {
    const report = await cursor.next();

    const text = report.text.replace(/(^|[^\n])\n(?!\n)/g, '$1\n\n');

    await reportsCollection.updateOne(
      { report_number: report.report_number },
      { $set: { text, plain_text: text } }
    );

    console.log(`Updated report ${report.report_number}`);
  }
};
