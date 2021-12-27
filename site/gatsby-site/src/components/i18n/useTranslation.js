import { LanguageEnumParam } from 'components/discover/queryParams';
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { useQueryParam } from 'use-query-params';
import { getLanguages } from './languages';

const LanguageContext = React.createContext({
  language: {},
  setLanguage: () => undefined,
  languages: getLanguages(),
});

function useTranslation() {
  const context = useContext(LanguageContext);

  return context;
}

function LanguageProvider({ children }) {
  const [languages] = useState(getLanguages());

  const [lang, setLang] = useQueryParam('lang', LanguageEnumParam);

  const [language, setLanguage] = useState(languages.find((l) => l.code == lang));

  useEffect(() => {
    setLang(language.code);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export { LanguageProvider };

export default useTranslation;
