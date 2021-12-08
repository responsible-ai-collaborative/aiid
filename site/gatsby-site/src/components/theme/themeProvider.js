import * as React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme } from './index';
import Header from '../Header';

const ThemeProvider = ({ children }) => (
  <div>
    <Header />
    <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
  </div>
);

export default ThemeProvider;
