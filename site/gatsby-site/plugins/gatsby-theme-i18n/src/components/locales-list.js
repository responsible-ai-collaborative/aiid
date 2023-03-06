import * as React from 'react';
import { useLocalization } from '../hooks/use-localization';

export const LocalesList = () => {
  const { config } = useLocalization();

  return (
    <ul>
      {config.map((locale) => (
        <li key={locale.code}>
          {locale.localName} ({locale.name})
        </li>
      ))}
    </ul>
  );
};
