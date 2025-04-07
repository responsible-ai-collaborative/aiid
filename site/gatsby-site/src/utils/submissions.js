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
  approved: {
    name: 'approved',
    text: 'Approved',
    color: 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900',
  },
  rejected: {
    name: 'rejected',
    text: 'Rejected',
    color: 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900',
  },
};

module.exports.getRowCompletionStatus = (properties) => {
  const nonEmptyCount = filter(properties, (value) => !isEmpty(value)).length;

  return Math.ceil((nonEmptyCount / properties.length) * 100);
};
