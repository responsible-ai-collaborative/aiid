import * as React from 'react';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import { Global } from '@emotion/core';

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
