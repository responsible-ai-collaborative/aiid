import React from 'react';

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `This website has been updated. Reload to display the latest version?`
  );

  if (answer === true) {
    window.location.reload();
  }
};

export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  const { pathname } = location;

  if (pathname.includes('/apps/discover')) {
    return false
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
import { UserContextProvider } from 'contexts/userContext';

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
      <UserContextProvider>
        <Header />
        {element}
      </UserContextProvider>
    </QueryParamProvider>
  );
};

export { wrapRootElement };
