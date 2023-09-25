export default function isValid(obj) {
  if ('rules' in obj) {
    if (obj.rules.length === 0) {
      return false;
    }

    for (const rule of obj.rules) {
      if (!isValid(rule)) {
        return false;
      }
    }
  } else {
    if (!('value' in obj) || !obj.value) {
      return false;
    }

    //TODO: check if this is needed
    // if (!('valueSource' in obj) || !obj.valueSource) {
    //   return false;
    // }
  }

  return true;
}
