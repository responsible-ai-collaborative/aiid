
/**
 * This function creates a entry into the Incident History collection
 * 
 * @param {object} input A JSON object that contains the Incident data
 * 
*/
exports = async (input) => {

  const incidentsHistory = context.services.get('mongodb-atlas').db('history').collection("incidents");

  const {
    AllegedDeployerOfAISystem,
    AllegedDeveloperOfAISystem,
    AllegedHarmedOrNearlyHarmedParties,
    ...incident } = input;

  incident['Alleged deployer of AI system'] = AllegedDeployerOfAISystem;
  incident['Alleged developer of AI system'] = AllegedDeveloperOfAISystem;
  incident['Alleged harmed or nearly harmed parties'] = AllegedHarmedOrNearlyHarmedParties;

  await incidentsHistory.insertOne(incident);

  return {
    incident_id: input.incident_id,
  }
};

if (typeof module === 'object') {
  module.exports = exports;
}