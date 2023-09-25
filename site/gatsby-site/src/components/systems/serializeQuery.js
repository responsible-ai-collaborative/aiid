import isArray from 'lodash/isArray';
import { formatQuery } from 'react-querybuilder';

const getOperation = (rule) => {
  switch (rule.operator) {
    case 'contains':
      return { $regex: rule.value, $options: 'i' };

    case '=':
      return { $eq: rule.value };

    case '!=':
      return { $ne: rule.value };

    case 'in':
      return { $in: !isArray(rule.value) ? [rule.value] : rule.value };

    case 'notIn':
      return { $nin: !isArray(rule.value) ? [rule.value] : rule.value };

    case 'between': {
      const [value1, value2] = rule.value;

      return { $gt: value1, $lt: value2 };
    }

    case '>=':
      return { $gt: rule.value };

    case '<=':
      return { $gt: rule.value };

    default:
      throw new Error(`Unknown operator ${rule.operator}`);
  }
};

export default function (filters) {
  const queries = filters
    .map((filter) => {
      const formatted = formatQuery(filter.config.query, {
        format: 'mongodb',
        ruleProcessor: (rule) => {
          const updated = {
            attributes: {
              $elemMatch: {
                short_name: rule.field,
                value: getOperation(rule),
              },
            },
          };

          const stringified = JSON.stringify(updated);

          return stringified;
        },
      });

      const parsed = JSON.parse(formatted);

      const updated = { namespace: filter.config.namespace, ...parsed };

      return updated;
    })
    .map((query) => JSON.stringify(query));

  const fullQuery = filters.length > 0 ? `{"$or": [${queries.join(',')}]}` : `{}`;

  return fullQuery;
}
