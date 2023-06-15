
/**
 * This function creates a entry into the Incident History collection
 * 
 * @param {object} input A JSON object that contains the Incident data
 * 
*/
exports = async (input) => {

  const incidentsHistory = context.services.get('mongodb-atlas').db('history').collection("incidents");

  const incident = input;
  incident.user = input.user.link;

  await incidentsHistory.insertOne(incident);

  return {
    incident_id: input.incident_id,
  }
};

if (typeof module === 'object') {
  module.exports = exports;
}