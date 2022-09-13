const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  reportsCollection.createIndex({ report_number: -1 }, { name: 'report_number_idx' });

  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  incidentsCollection.createIndex({ incident_id: -1 }, { name: 'incident_id_idx' });
};

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */
exports.down = async ({ context: { client } }) => {
  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  reportsCollection.dropIndex('report_number_idx');

  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  incidentsCollection.dropIndex('incident_id_idx');
};
