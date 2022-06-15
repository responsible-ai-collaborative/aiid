import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useLocalization } from 'gatsby-theme-i18n';
import { navigate } from 'gatsby';
import { localizePath } from '../../../i18n';

export default function LanguageSwitcher() {
  const { locale: currentLang, config } = useLocalization();

  const currentLocale = config.find((c) => c.code == currentLang);

  const setLanguage = (newLang) => {
    const { pathname: path, search } = new URL(window.location.href);

    const newPath = localizePath({ currentLang, newLang, path });

    navigate(newPath + search);
  };

  return (
    <DropdownButton id="dropdown-basic-button" title={currentLocale.name}>
      {config.map((locale) => (
        <Dropdown.Item key={locale.code} onClick={() => setLanguage(locale.code)}>
          {locale.name}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
