import React from 'react';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import useLocalizePath from './useLocalizePath';
import { Badge, Dropdown } from 'flowbite-react';

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
    <div
      className="mr-3 md:mr-0 border border-gray-500 p-2 rounded-md hover:bg-white hover:text-gray-900"
      data-cy="language-switcher"
    >
      <Dropdown
        id="dropdown-basic-button"
        label={
          <span className="flex">
            {currentLocale.localName}
            {currentLocale.code === 'fr' && (
              <span className="mx-2 rounded hidden sm:flex">
                <Badge>Beta</Badge>
              </span>
            )}
          </span>
        }
        className={className + ' flex items-center'}
        inline={true}
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
      </Dropdown>
    </div>
  );
}
