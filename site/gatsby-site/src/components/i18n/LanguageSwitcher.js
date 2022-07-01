import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useLocalization } from 'gatsby-theme-i18n';
import { navigate } from 'gatsby';
import useLocalizePath from './useLocalizePath';

export default function LanguageSwitcher() {
  const { locale: currentLang, config } = useLocalization();

  const localizedPath = useLocalizePath();

  const currentLocale = config.find((c) => c.code == currentLang);

  const setLanguage = (language) => {
    const { pathname: path, search } = new URL(window.location.href);

    const newPath = localizedPath({ path, language });

    navigate(newPath + search);
  };

  return (
    <DropdownButton id="dropdown-basic-button" title={currentLocale.localName}>
      {config.map((locale) => (
        <Dropdown.Item key={locale.code} onClick={() => setLanguage(locale.code)}>
          {locale.name}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
