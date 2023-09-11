const isEmpty = require('lodash/isEmpty');

const filter = require('lodash/filter');

module.exports.STATUS = {
  inReview: {
    name: 'inReview',
    text: 'In Review',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900',
  },
  pendingReview: {
    name: 'pendingReview',
    text: 'Pending Review',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-200 dark:text-orange-900',
  },
};

module.exports.getRowCompletionStatus = (properties) => {
  const nonEmptyCount = filter(properties, (value) => !isEmpty(value)).length;

  return Math.ceil((nonEmptyCount / properties.length) * 100);
};
