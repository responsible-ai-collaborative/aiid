const config = require('../config');

const languages = require('./config.json');

module.exports.getLanguages = () =>
  languages.filter((lang) => config.i18n.availableLanguages.includes(lang.code));

module.exports.switchLocalizedPath = ({
  currentLang = config.i18n.defaultLanguage,
  newLang,
  path,
}) => {
  let newPath;

  const paths = path.split('/');

  if (
    currentLang !== config.i18n.defaultLanguage &&
    this.getLanguages().find((c) => c.code == paths[1])
  ) {
    paths[1] = newLang;

    newPath = paths.join('/');
  } else {
    const [first, ...others] = paths;

    newPath = [first, newLang, ...others].join('/');
  }

  if (newLang == config.i18n.defaultLanguage) {
    newPath = newPath
      .split('/')
      .filter((_, i) => i !== 1)
      .join('/');
  }

  return newPath;
};
