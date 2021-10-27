/**
 * Get the month name, day, and year that the citation is
 * being referenced.
 *
 * @return {string} The month, day, and year as a string.
 */
export const retrievalDate = () => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const today = new Date();

  const dd = String(today.getDate());

  const month = monthNames[today.getMonth()];

  const yyyy = today.getFullYear();

  return `${month} ${dd}, ${yyyy}`;
};

// RegEx for date validation
export const dateRegExp = /^(\+?\d{4})?\s?-?\s?(\(?\d{2}\)?)\s?-?\s?(\(?\d{2}\)?)\s?-?\s?(\?)?$/;

export const validateDate = (date) => {
  const dateStr = date + '';

  if (dateStr.length <= 10) {
    return date * 1000;
  }
  return date;
};
