const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const candidatesCollection = client
    .db(config.realm.production_db.db_name)
    .collection('candidates');

  candidatesCollection.createIndex({ date_published: 1, match: 1 });
  candidatesCollection.createIndex({ url: 1 });

  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  reportsCollection.createIndex({ url: 1 });
  reportsCollection.createIndex({ epoch_date_published: 1 });
  reportsCollection.createIndex({ authors: 1 });

  const reportsFRCollection = client.db('translations').collection('reports_fr');

  reportsFRCollection.createIndex({ report_number: 1 });

  const reportsESCollection = client.db('translations').collection('reports_es');

  reportsESCollection.createIndex({ report_number: 1 });
};
