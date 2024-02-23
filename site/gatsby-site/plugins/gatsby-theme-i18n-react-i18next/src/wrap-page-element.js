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
    let data = null;

    try {
      data = require(`${GATSBY_THEME_I18N_REACT_I18NEXT}/${locale}/${name}.json`);
    } catch (error) {
      console.error(
        `[gatsby-theme-i18n-react-i18next]: Failed to load translation file for ${locale}/${name}.json. Please create i18n/locales/${locale} folder and add ${name}.json there. Now defaulting to en/${name}.json`
      );
      data = require(`${GATSBY_THEME_I18N_REACT_I18NEXT}/en/${name}.json`);
    }

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
