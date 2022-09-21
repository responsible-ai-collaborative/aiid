import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useLocalization } from 'gatsby-theme-i18n';
import { navigate } from 'gatsby';
import useLocalizePath from './useLocalizePath';
import { Badge } from 'flowbite-react';

export default function LanguageSwitcher({ className = '' }) {
  const { locale: currentLang, config } = useLocalization();

  const localizedPath = useLocalizePath();

  const currentLocale = config.find((c) => c.code == currentLang);

  const setLanguage = (language) => {
    const { pathname: path, search } = new URL(window.location.href);

    const newPath = localizedPath({ path, language });

    navigate(newPath + search);
  };

  return (
    <div className="bootstrap">
      <DropdownButton
        id="dropdown-basic-button"
        title={currentLocale.localName}
        data-cy="language-switcher"
        className={className}
        variant="outline-light"
      >
        {config.map((locale) => (
          <Dropdown.Item
            key={locale.code}
            onClick={() => setLanguage(locale.code)}
            className="flex"
          >
            {locale.name}
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
