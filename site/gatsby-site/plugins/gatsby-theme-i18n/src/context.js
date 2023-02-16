import * as React from 'react';
import { defaultLang } from '../utils/default-options';

const LocaleContext = React.createContext(defaultLang);

const LocaleProvider = ({ children, pageContext: { locale = defaultLang } }) => (
  <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
);

export { LocaleContext, LocaleProvider };
