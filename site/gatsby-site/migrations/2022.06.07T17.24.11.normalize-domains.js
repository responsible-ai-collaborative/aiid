const config = require('../config');

/**
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */
exports.up = async ({ context: { client } }) => {
  const submissions = client.db(config.realm.production_db.db_name).collection('submissions');

  const submissionsCursor = await submissions.find({ source_domain: { $regex: '^(www|m)\\.' } });

  let batch = [];

  const batchSize = 5;

  while (await submissionsCursor.hasNext()) {
    const submission = await submissionsCursor.next();

    const update = {
      updateOne: {
        filter: { _id: submission._id },
        update: { $set: { source_domain: submission.source_domain.replace(/^(www|m)\./, '') } },
      },
    };

    batch.push(update);

    if (batch.length == batchSize || !(await submissionsCursor.hasNext())) {
      await submissions.bulkWrite(batch);

      batch = [];
    }
  }

  const reports = client.db(config.realm.production_db.db_name).collection('reports');

  const reportsCursor = await reports.find({ source_domain: { $regex: '^(www|m)\\.' } });

  batch = [];

  while (await reportsCursor.hasNext()) {
    const report = await reportsCursor.next();

    const update = {
      updateOne: {
        filter: { _id: report._id },
        update: { $set: { source_domain: report.source_domain.replace(/^(www|m)\./, '') } },
      },
    };

    batch.push(update);

    if (batch.length == batchSize || !(await reportsCursor.hasNext())) {
      await reports.bulkWrite(batch);

      batch = [];
    }
  }
};
