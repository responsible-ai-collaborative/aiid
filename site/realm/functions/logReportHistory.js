
/**
 * This function creates a entry into the Report History collection
 * 
 * @param {object} report A JSON object that contains the Report data
 * 
*/
exports = async (input) => {

  const reportsHistory = context.services.get('mongodb-atlas').db('history').collection("reports");

  input.user = input.user.link;

  await reportsHistory.insertOne(input);

  return {
    report_number: input.report_number,
  }
};

if (typeof module === 'object') {
  module.exports = exports;
}