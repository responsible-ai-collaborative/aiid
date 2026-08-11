import { parse } from 'date-fns';

/**
 * date-fns v3+ throws a TypeError when the value passed to parse() is not a
 * string, where v2 returned an Invalid Date. Callers here rely on the old
 * behaviour (checking isValid / 'Invalid Date'), so preserve it.
 *
 * @param {unknown} value
 * @param {string} formatStr
 * @param {Date} referenceDate
 * @return {Date}
 */
export const safeParse = (value, formatStr, referenceDate) =>
  typeof value === 'string' ? parse(value, formatStr, referenceDate) : new Date(NaN);

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
    const parsedDate = safeParse(value, 'yyyy-MM-dd', new Date());

    const today = new Date();

    return parsedDate <= today;
  },
};
