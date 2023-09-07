import qs from 'qs';

function createTransform() {
  let taxonomyCounter = 0;

  return function recursiveTransform(obj) {
    if (Array.isArray(obj)) {
      return obj.map(recursiveTransform);
    }

    if (typeof obj === 'object' && obj !== null) {
      let newObj = {};

      if ('type' in obj && obj.type === 'taxonomy') {
        newObj['id'] = `taxonomy-${taxonomyCounter++}`;
      }

      for (const [key, value] of Object.entries(obj)) {
        if (key.startsWith('[') && key.endsWith(']')) {
          const newKey = key.slice(1, -1);

          newObj[newKey] = recursiveTransform(value);
          newObj['valueSource'] = 'value';
        } else {
          newObj[key] = recursiveTransform(value);
        }
      }

      return newObj;
    }

    return obj;
  };
}

export default function (queryString) {
  const parsed = qs.parse(queryString, { parseArrays: true });

  const updated = createTransform()(parsed);

  return updated;
}
