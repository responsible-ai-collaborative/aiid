function isDefaultLang(locale, defaultLang) {
  return locale === defaultLang;
}

function localizedPath({ defaultLang, prefixDefault, locale, path }) {
  // The default language isn't prefixed
  if (isDefaultLang(locale, defaultLang) && !prefixDefault) {
    return path;
  }

  const [, base] = path.split(`/`);

  // If for whatever reason we receive an already localized path
  // (e.g. if the path was made with location.pathname)
  // just return it as-is.
  if (base === locale) {
    return path;
  }

  // If it's another language, prefix with the locale
  return `/${locale}${path}`;
}

function getLanguages({ locales, localeStr }) {
  // If "localeStr" is not defined, return the list of locales from the i18n config file
  if (!localeStr) {
    return locales;
  }

  const langCodes = localeStr.split(` `);

  const langs = [];

  for (const code of langCodes) {
    const lang = locales.find((lang) => lang.code === code);

    if (!lang) {
      throw new Error(
        `Invalid localed provided: ${code}. See your i18n config file for a list of available locales.`
      );
    }

    langs.push(lang);
  }

  return langs;
}

function getDefaultLanguage({ locales, defaultLang }) {
  return locales.find((locale) => locale.code === defaultLang);
}

module.exports = {
  localizedPath,
  getLanguages,
  getDefaultLanguage,
};
