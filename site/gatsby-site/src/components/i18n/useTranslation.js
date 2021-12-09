import React, { useContext } from 'react';
import { useState } from 'react';
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

  const [language, setLanguage] = useState(languages.find((l) => l.code == 'en'));

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export { LanguageProvider };

export default useTranslation;
