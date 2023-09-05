import qs from 'qs';

function stripProperties(obj, propertiesToStrip = ['id', 'valueSource']) {
  if (Array.isArray(obj)) {
    return obj.map((item) => stripProperties(item, propertiesToStrip));
  }

  if (typeof obj === 'object' && obj !== null) {
    let newObj = {};

    for (const [key, value] of Object.entries(obj)) {
      if (!propertiesToStrip.includes(key)) {
        newObj[key] = stripProperties(value, propertiesToStrip);
      }
    }

    return newObj;
  }

  return obj;
}

export default function (filters) {
  const updated = stripProperties(filters);

  return qs.stringify({ filters: updated }, { encodeValuesOnly: true });
}
