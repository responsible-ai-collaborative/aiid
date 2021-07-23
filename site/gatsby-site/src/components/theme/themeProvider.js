import * as React from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';

import { theme } from './index';
import Header from '../Header';
import '../styles/GlobalStyles';

const ThemeProvider = ({ children }) => (
  <div>
    <Header />
    <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
  </div>
);

export default ThemeProvider;
