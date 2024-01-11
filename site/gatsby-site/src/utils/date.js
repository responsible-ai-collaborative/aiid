import { parse } from 'date-fns';

// RegEx for date validation
export const dateRegExp = /^(\+?\d{4})?\s?-?\s?(\(?\d{2}\)?)\s?-?\s?(\(?\d{2}\)?)\s?-?\s?(\?)?$/;
export const dateTimeRegExp =
  /(\d{4}-[01]\d-[0-3]\d(T[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)?)?)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)?)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)?)/;

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
