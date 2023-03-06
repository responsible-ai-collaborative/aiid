const defaultLang = `en`;

function withDefaults(themeOptions) {
  return {
    ...themeOptions,
    configPath: themeOptions.configPath,
    defaultLang: themeOptions.defaultLang || defaultLang,
    prefixDefault: themeOptions.prefixDefault ? themeOptions.prefixDefault : false,
    locales: themeOptions.locales || null,
  };
}

module.exports = {
  defaultLang,
  withDefaults,
};
