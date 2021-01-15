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
