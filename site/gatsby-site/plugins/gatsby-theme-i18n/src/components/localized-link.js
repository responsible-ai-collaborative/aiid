import * as React from 'react';
import { Link } from 'gatsby';
import { localizedPath } from '../helpers';
import { useLocalization } from '../hooks/use-localization';

export const LocalizedLink = ({ to, language, ...props }) => {
  const { defaultLang, prefixDefault, locale } = useLocalization();

  const linkLocale = language || locale;

  return (
    <Link
      {...props}
      to={localizedPath({
        defaultLang,
        prefixDefault,
        locale: linkLocale,
        path: to,
      })}
    />
  );
};
