import * as React from 'react';
import { Router } from '@reach/router';
import { useLocalization } from '../hooks/use-localization';

export const LocalizedRouter = ({ basePath, children, ...props }) => {
  const { localizedPath, locale, defaultLang, prefixDefault } = useLocalization();

  const path = localizedPath({
    defaultLang,
    prefixDefault,
    locale,
    path: basePath,
  });

  return (
    <Router basepath={path} {...props}>
      {children}
    </Router>
  );
};
