import React from 'react';
import { ToastContextProvider } from './src/contexts/ToastContext';
import ThemeProvider from 'components/theme/themeProvider';

export const wrapRootElement = ({ element }) => {
  return (
    <ThemeProvider>
      <ToastContextProvider>{element}</ToastContextProvider>
    </ThemeProvider>
  );
};
