import * as React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme } from './index';

const ThemeProvider = ({ children }) => (
  <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
);

export default ThemeProvider;
