const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  const reportsCursor = await reportsCollection.find({
    $or: [{ text_inputs: { $exists: true } }, { text_outputs: { $exists: true } }],
  });

  while (await reportsCursor.hasNext()) {
    const report = await reportsCursor.next();

    const text_inputs = report.text_inputs;

    const text_outputs = report.text_outputs;

    const newText = `${text_inputs}\n\n-----\n\n${text_outputs}`;

    console.log(`Updating report ${report.report_number} text: ${JSON.stringify(newText)}`);

    await reportsCollection.updateOne(
      { report_number: report.report_number },
      {
        $set: { text: newText },
        $unset: { text_inputs: '', text_outputs: '' },
      }
    );
  }
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
