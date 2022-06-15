module.exports = ({ currentLang, newLang, defaultLang, path, list }) => {
  let newPath;

  const paths = path.split('/');

  if (currentLang !== defaultLang && list.find((c) => c.code == paths[1])) {
    paths[1] = newLang;

    newPath = paths.join('/');
  } else {
    const [first, ...others] = paths;

    newPath = [first, newLang, ...others].join('/');
  }

  if (newLang == defaultLang) {
    newPath = newPath
      .split('/')
      .filter((_, i) => i !== 1)
      .join('/');
  }

  return newPath;
};
