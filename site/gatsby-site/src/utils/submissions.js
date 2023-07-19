const isEmpty = require('lodash/isEmpty');

const filter = require('lodash/filter');

module.exports.STATUS = {
  inReview: { name: 'inReview', text: 'In Review', color: 'success' },
  pendingReview: { name: 'pendingReview', text: 'Pending Review', color: 'warning' },
};

module.exports.getRowCompletionStatus = (properties) => {
  const nonEmptyCount = filter(properties, (value) => !isEmpty(value)).length;

  return Math.ceil((nonEmptyCount / properties.length) * 100);
};
