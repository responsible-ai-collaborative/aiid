export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `This website has been updated. Reload to display the latest version?`
  );

  if (answer === true) {
    window.location.reload();
  }
};

const ROUTES_WITH_RULES = ['/cite/', '/apps/discover'];

export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  const { pathname, hash } = location;

  if (ROUTES_WITH_RULES.includes(pathname)) {
    if (pathname.includes('/cite/') && hash !== '') {
      // Scroll to where the cite hash link page points to
      return false;
    }

    if (pathname.includes('/cite/') && hash === '') {
      // Scoll to top when cite pate is accessed without an incident report hash
      window.scrollTo(0, 0);
    }

    if (pathname !== '/apps/discover') {
      // Don't allow Gatsby to scroll to top when picking a search filter
      window.scrollTo(0, 0);
    }
  } else {
    return false;
  }
};

import React from 'react';
import { ToastContextProvider } from './src/contexts/ToastContext';
import ThemeProvider from './src/components/theme/themeProvider';
import Header from 'components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './src/global.css';

export const wrapRootElement = ({ element }) => {
  return (
    <ThemeProvider>
      <ToastContextProvider>
        <Header />
        {element}
      </ToastContextProvider>
    </ThemeProvider>
  );
};
