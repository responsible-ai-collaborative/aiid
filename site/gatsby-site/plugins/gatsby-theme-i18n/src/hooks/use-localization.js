import * as React from 'react';
import { LocaleContext } from '../context';
import { graphql, useStaticQuery } from 'gatsby';
import { localizedPath } from '../helpers';

const useLocalization = () => {
  const locale = React.useContext(LocaleContext);

  const {
    themeI18N: { defaultLang, prefixDefault, config },
  } = useStaticQuery(graphql`
    query LocalizationConfigQuery {
      themeI18N {
        defaultLang
        prefixDefault
        config {
          code
          hrefLang
          dateFormat
          langDir
          localName
          name
        }
      }
    }
  `);

  return {
    locale,
    defaultLang,
    prefixDefault,
    config,
    localizedPath,
  };
};

export { useLocalization };
