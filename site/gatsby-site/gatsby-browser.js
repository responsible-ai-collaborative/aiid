import React from 'react';

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

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './src/global.css';
import { wrapRootElement } from './wrapRootElement';
import Header from 'components/Header';
import { QueryParamProvider } from 'use-query-params';
import { navigate } from 'gatsby';

export const wrapPageElement = ({ element }) => {
  const history = {
    replace(location) {
      navigate(location.search, { replace: true });
    },
    push(location) {
      navigate(location.search, { replace: false });
    },
  };

  return (
    <QueryParamProvider history={history}>
      <Header />
      {element}
    </QueryParamProvider>
  );
};

export { wrapRootElement };
