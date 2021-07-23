import * as React from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { Global } from '@emotion/css';

import { theme } from './index';
import Header from '../Header';
import { baseStyles } from '../styles/GlobalStyles';

const ThemeProvider = ({ children }) => (
  <div>
    <Global styles={baseStyles} />
    <Header />
    <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
  </div>
);

export default ThemeProvider;
