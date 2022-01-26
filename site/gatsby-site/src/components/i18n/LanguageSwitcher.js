import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import useTranslation from './useTranslation';

export default function LanguageSwitcher() {
  const { language, setLanguage, languages } = useTranslation();

  return (
    <DropdownButton id="dropdown-basic-button" title={language.name}>
      {languages.map((lang) => (
        <Dropdown.Item key={lang.code} onClick={() => setLanguage(lang)}>
          {lang.name}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
