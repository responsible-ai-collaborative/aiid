// RegEx for date validation
export const dateRegExp = /^(\+?\d{4})?\s?-?\s?(\(?\d{2}\)?)\s?-?\s?(\(?\d{2}\)?)\s?-?\s?(\?)?$/;

export const validateDate = (date) => {
  const dateStr = date + '';

  if (dateStr.length <= 10) {
    return date * 1000;
  }
  return date;
};
