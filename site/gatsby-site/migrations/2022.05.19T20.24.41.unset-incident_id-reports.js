/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const reportsCollection = client.db('aiidprod').collection('reports');

  const result = await reportsCollection.updateMany({}, { $unset: { incident_id: '' } });

  console.log(`Unset incident_id field from ${result.modifiedCount} reports.`);
};
