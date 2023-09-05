import qs from 'qs';

function createTransformFunction() {
  let counter = 0;

  function transformObject(obj) {
    if (Array.isArray(obj)) {
      return obj.map((item) => transformObject(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      const newObj = {};

      if (obj.type === 'taxonomy') {
        newObj['id'] = `taxonomy-${counter++}`;
      }

      for (const [key, value] of Object.entries(obj)) {
        if (key === 'rules') {
          newObj[key] = value.map((rule) => {
            return {
              ...rule,
              valueSource: 'value',
            };
          });
        } else {
          newObj[key] = transformObject(value);
        }
      }

      return newObj;
    }

    return obj;
  }

  return transformObject;
}

export default function (query) {
  const transform = createTransformFunction();

  const parsed = qs.parse(query, { parseArrays: true });

  const updated = transform(parsed);

  return updated;
}
