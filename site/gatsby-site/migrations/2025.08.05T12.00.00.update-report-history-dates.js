const config = require('../config');

/**
 * Migration to convert date fields from string (yyyy-mm-dd) to Date type
 * in all documents of the history.reports collection
 *
 * Fields to convert:
 * - date_downloaded
 * - date_modified
 * - date_published
 * - date_submitted
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const dbHistory = client.db(config.realm.production_db.db_history_name);

  const reportsHistory = dbHistory.collection('reports');

  // Find documents where at least one of the date fields is a string
  const docs = await reportsHistory
    .find({
      $or: [
        { date_downloaded: { $type: 'string' } },
        { date_modified: { $type: 'string' } },
        { date_published: { $type: 'string' } },
        { date_submitted: { $type: 'string' } },
      ],
    })
    .toArray();

  console.log(`Found ${docs.length} documents with date fields as strings`);

  let updateCount = 0;

  for (const doc of docs) {
    const updateFields = {};

    // Convert each date field if it's a string
    ['date_downloaded', 'date_modified', 'date_published', 'date_submitted'].forEach((field) => {
      if (doc[field] && typeof doc[field] === 'string') {
        // Create Date object from string format yyyy-mm-dd
        // Add 'T00:00:00.000Z' to ensure ISO format and UTC
        const dateValue = new Date(doc[field] + 'T00:00:00.000Z');

        if (!isNaN(dateValue.getTime())) {
          updateFields[field] = dateValue;
        } else {
          console.warn(`Invalid date value in document ${doc._id}, field ${field}: ${doc[field]}`);
        }
      }
    });

    // Only update if there are fields to update
    if (Object.keys(updateFields).length > 0) {
      await reportsHistory.updateOne({ _id: doc._id }, { $set: updateFields });
      updateCount++;
      console.log(
        `Updated document report_number: ${doc.report_number} - fields: ${Object.keys(
          updateFields
        ).join(', ')}`
      );
    }
  }

  console.log(`Migration completed! Updated ${updateCount} documents`);
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {
  // Cannot be automatically reverted as we would lose the original string format
  console.log('This migration is not automatically reversible');
};
