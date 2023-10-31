import { parse } from 'date-fns';

// RegEx for date validation
export const dateRegExp = /^(\+?\d{4})?\s?-?\s?(\(?\d{2}\)?)\s?-?\s?(\(?\d{2}\)?)\s?-?\s?(\?)?$/;
export const dateTimeRegExp = /^(\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)?)$/;

export const validateDate = (date) => {
  const dateStr = date + '';

  if (dateStr.length <= 10) {
    return date * 1000;
  }
  return date;
};

export const isPastDate = {
  message: '*Date must be in the past',
  test(value) {
    const parsedDate = parse(value, 'yyyy-MM-dd', new Date());

    const today = new Date();

    return parsedDate <= today;
  },
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
};
