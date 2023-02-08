import './src/tailwind.css';
import './src/global.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './src/custom.css';
import './src/bootstrap.scss';

import React from 'react';
import { wrapRootElement } from './wrapRootElement';
import { QueryParamProvider } from 'use-query-params';
import { navigate } from 'gatsby';
import { UserContextProvider } from 'contexts/userContext';
import { MenuContextProvider } from 'contexts/MenuContext';

export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  const { pathname } = location;

  if (pathname.includes('/apps/discover')) {
    return false;
  }
};

export const wrapPageElement = ({ element }) => {
  const history = {
    replace(location) {
      navigate(location.pathname + location.search, { replace: true });
    },
    push(location) {
      navigate(location.pathname + location.search, { replace: false });
    },
  };

  return (
    <QueryParamProvider history={history}>
      <MenuContextProvider>
        <UserContextProvider>{element}</UserContextProvider>
      </MenuContextProvider>
    </QueryParamProvider>
  );
};

export { wrapRootElement };
