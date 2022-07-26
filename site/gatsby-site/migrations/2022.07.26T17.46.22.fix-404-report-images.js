const config = require('../config');

/**
 * @type {import('umzug').MigrationFn<any>}
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */
exports.up = async ({ context: { client } }) => {
  const collection = client.db(config.realm.production_db.db_name).collection('reports');

  await collection.updateOne(
    { report_number: 1173 },
    {
      $set: {
        cloudinary_id:
          'reports/images.khaleejtimes.com/storyimage/KT/20170804/ARTICLE/170809597/AR/0/AR-170809597.jpg',
      },
    }
  );

  await collection.updateOne(
    { report_number: 1175 },
    { $set: { cloudinary_id: 'reports/s2.reutersmedia.net' } }
  );
};
