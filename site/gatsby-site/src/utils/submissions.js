const isEmpty = require('lodash/isEmpty');

const filter = require('lodash/filter');

module.exports.STATUS = {
  'In Review': { text: 'In Review', color: 'success' },
  'Pending Review': { text: 'Pending Review', color: 'warning' },
};

module.exports.getRowCompletionStatus = (properties) => {
  const nonEmptyCount = filter(properties, (value) => !isEmpty(value)).length;

  return Math.ceil((nonEmptyCount / properties.length) * 100);
};
