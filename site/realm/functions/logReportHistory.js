
/**
 * This function creates a entry into the Report History collection
 * 
 * @param {object} input A JSON object that contains the Report data
 * 
*/
exports = async (input) => {

  const reportsHistory = context.services.get('mongodb-atlas').db('history').collection("reports");

  const report = input;

  await reportsHistory.insertOne(report);

  return {
    report_number: input.report_number,
  }
};

if (typeof module === 'object') {
  module.exports = exports;
}