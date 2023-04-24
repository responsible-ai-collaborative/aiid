import React from 'react';
import { navigate } from 'gatsby';
import { QueryParamProvider } from 'use-query-params';
import { UserContextProvider } from 'contexts/userContext';
import { MenuContextProvider } from 'contexts/MenuContext';
import { ToastContextProvider } from './src/contexts/ToastContext';
import ThemeProvider from 'components/theme/themeProvider';
import { Script } from 'gatsby';
import { LayoutContextProvider } from 'contexts/LayoutContext';
import { LocaleProvider } from 'plugins/gatsby-theme-i18n';

export const wrapPageElement = ({ element, props }) => {
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
    <LocaleProvider pageContext={props.pageContext}>
      <QueryParamProvider history={history} location={location}>
        <MenuContextProvider location={location}>
          <UserContextProvider>
            <LayoutContextProvider location={location}>{element}</LayoutContextProvider>
          </UserContextProvider>
        </MenuContextProvider>
      </QueryParamProvider>
    </LocaleProvider>
  );
};

export const wrapRootElement = ({ element }) => {
  return (
    <>
      <Script src="/rollbar.js" />
      <ThemeProvider>
        <ToastContextProvider>{element}</ToastContextProvider>
      </ThemeProvider>
    </>
  );
};
