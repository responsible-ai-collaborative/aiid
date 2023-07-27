const config = require('../config');

function getUnixTime(dateString) {
  return Math.floor(new Date(dateString).getTime() / 1000);
}
/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  // New epoch_date_modified field on submissions collection
  const submissionsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('submissions');

  const submissionsCursor = submissionsCollection.find({});

  while (await submissionsCursor.hasNext()) {
    const submission = await submissionsCursor.next();

    const epoch_date_modified = getUnixTime(new Date(submission.date_modified));

    console.log(
      `Updating submission ${submission._id} with epoch_date_modified "${epoch_date_modified}"`
    );

    await submissionsCollection.updateOne(
      { _id: submission._id },
      {
        $set: {
          epoch_date_modified: epoch_date_modified,
        },
      }
    );

    submission.epoch_date_modified = epoch_date_modified;
  }
};
