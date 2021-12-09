import React from 'react';

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `This website has been updated. Reload to display the latest version?`
  );

  if (answer === true) {
    window.location.reload();
  }
};

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

import '@fortawesome/fontawesome-svg-core/styles.css';

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

import { ToastContextProvider } from './src/contexts/ToastContext';

export const wrapRootElement = ({ element }) => {
  return <ToastContextProvider>{element}</ToastContextProvider>;
};

export const wrapPageElement = ({ element, props }) => {
  return <LanguageProvider {...props}>{element}</LanguageProvider>;
};

import './src/global.css';
import { LanguageProvider } from 'components/i18n/useTranslation';
