import React from 'react';
import { ToastContextProvider } from './src/contexts/ToastContext';
import ThemeProvider from 'components/theme/themeProvider';
import SSRProvider from 'react-bootstrap/SSRProvider';

export const wrapRootElement = ({ element }) => {
  return (
    <SSRProvider>
      <ThemeProvider>
        <ToastContextProvider>{element}</ToastContextProvider>
      </ThemeProvider>
    </SSRProvider>
  );
};
