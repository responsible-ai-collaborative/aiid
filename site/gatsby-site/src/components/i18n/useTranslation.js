import React, { useContext } from 'react';
import { useState } from 'react';
import languages from './languages.json';

const LanguageContext = React.createContext({
  language: {},
  setLanguage: () => undefined,
  languages,
});

function useTranslation() {
  const context = useContext(LanguageContext);

  return context;
}

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(languages.find((l) => l.code == 'en'));

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export { LanguageProvider };

export default useTranslation;
