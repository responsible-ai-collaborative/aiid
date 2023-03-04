/* global GATSBY_THEME_I18N_REACT_I18NEXT */
import * as React from 'react';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { withDefaults } from '../utils/default-options';

const wrapPageElement = ({ element, props }, themeOptions) => {
  const { i18nextOptions } = withDefaults(themeOptions);

  const locale = props.pageContext.locale;

  let resources = {};

  i18nextOptions.ns.forEach((name) => {
    const data = require(`${GATSBY_THEME_I18N_REACT_I18NEXT}/${locale}/${name}.json`);

    resources = {
      ...resources,
      [locale]: {
        ...resources[locale],
        [name]: data,
      },
    };
  });

  const i18nConfig = {
    lng: locale,
    resources,
    ...i18nextOptions,
  };

  i18n.init(i18nConfig);

  return <I18nextProvider i18n={i18n}>{element}</I18nextProvider>;
};

export { wrapPageElement };
