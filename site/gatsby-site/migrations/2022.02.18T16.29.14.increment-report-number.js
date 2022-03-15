const lodash = require('lodash');

const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const collection = client.db(config.realm.production_db.db_name).collection('incidents');

  const reports = await collection.find({}).toArray();

  const sorted = lodash.sortBy(reports, 'report_number');

  let duplicateIndex = 0;

  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].report_number && sorted[i].report_number == sorted[i + 1].report_number) {
      duplicateIndex = i + 1;
      break;
    }
  }

  if (duplicateIndex !== 0) {
    let report_number = sorted[duplicateIndex].report_number;

    for (let i = duplicateIndex; i < sorted.length; i++) {
      report_number++;

      await collection.updateOne({ _id: sorted[i]._id }, { $set: { report_number } });

      console.log(
        `Updated report number for ${sorted[i]._id} from ${sorted[i].report_number} to ${report_number}`
      );
    }
  }
};
