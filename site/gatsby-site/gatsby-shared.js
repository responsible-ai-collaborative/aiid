import React from 'react';
import { navigate } from 'gatsby';
import { QueryParamProvider } from 'use-query-params';
import { UserContextProvider } from 'contexts/userContext';
import { MenuContextProvider } from 'contexts/MenuContext';
import { ToastContextProvider } from './src/contexts/ToastContext';
import ThemeProvider from 'components/theme/themeProvider';
import SSRProvider from 'react-bootstrap/SSRProvider';
import { Script } from 'gatsby';

export const wrapPageElement = ({ element }) => {
  const history = {
    replace(location) {
      navigate(location.pathname + location.search, { replace: true });
    },
    push(location) {
      navigate(location.pathname + location.search, { replace: false });
    },
  };

  const location = typeof window == 'undefined' ? {} : window.location;

  return (
    <QueryParamProvider history={history} location={location}>
      <MenuContextProvider>
        <UserContextProvider>{element}</UserContextProvider>
      </MenuContextProvider>
    </QueryParamProvider>
  );
};

export const wrapRootElement = ({ element }) => {
  return (
    <>
      <Script src="/rollbar.js" />
      <SSRProvider>
        <ThemeProvider>
          <ToastContextProvider>{element}</ToastContextProvider>
        </ThemeProvider>
      </SSRProvider>
    </>
  );
};
