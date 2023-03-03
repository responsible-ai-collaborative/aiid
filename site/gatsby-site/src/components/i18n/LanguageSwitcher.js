import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useLocalization } from 'gatsby-theme-i18n';
import useLocalizePath from './useLocalizePath';
import { Badge } from 'flowbite-react';

export default function LanguageSwitcher({ className = '' }) {
  const { locale: currentLang, config } = useLocalization();

  const localizedPath = useLocalizePath();

  const currentLocale = config.find((c) => c.code == currentLang);

  const setLanguage = (language) => {
    const { pathname: path, search } = new URL(window.location.href);

    const newPath = localizedPath({ path, language });

    window.location.href = newPath + search;
  };

  return (
    <div className="bootstrap">
      <DropdownButton
        id="dropdown-basic-button"
        title={
          <span className="flex">
            {currentLocale.localName}
            {currentLocale.code === 'fr' && (
              <span className="mx-2 rounded hidden sm:flex">
                <Badge>Beta</Badge>
              </span>
            )}
          </span>
        }
        data-cy="language-switcher"
        className={className + ' flex items-center'}
        variant="outline-light"
      >
        {config.map((locale) => (
          <Dropdown.Item
            key={locale.code}
            onClick={() => setLanguage(locale.code)}
            className="flex"
          >
            {locale.localName}
            {locale.code === 'fr' && (
              <span className="ml-2 rounded">
                <Badge>Beta</Badge>
              </span>
            )}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  );
}
