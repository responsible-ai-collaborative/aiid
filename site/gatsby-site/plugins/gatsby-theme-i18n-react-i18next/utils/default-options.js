const defaultNamespace = `translation`;

const fallbackLng = `en`;

function withDefaults(themeOptions) {
  return {
    ...themeOptions,
    i18nextOptions: {
      defaultNS: defaultNamespace,
      ns: [defaultNamespace],
      fallbackLng,
      initImmediate: false,
      ...themeOptions.i18nextOptions,
      interpolation: {
        escapeValue: false,
        ...themeOptions.i18nextOptions.interpolation,
      },
    },
  };
}

module.exports = {
  defaultNamespace,
  withDefaults,
};
