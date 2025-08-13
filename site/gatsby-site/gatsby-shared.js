import React from 'react';
import { navigate } from 'gatsby';
import { QueryParamProvider } from 'use-query-params';
import { UserContextProvider } from 'contexts/UserContext';
import { MenuContextProvider } from 'contexts/MenuContext';
import { ToastContextProvider } from 'contexts/ToastContext';
import { SessionProvider } from 'next-auth/react';

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
    <SessionProvider>
      <QueryParamProvider history={history} location={location}>
        <MenuContextProvider>
          <UserContextProvider>{element}</UserContextProvider>
        </MenuContextProvider>
      </QueryParamProvider>
    </SessionProvider>
  );
};

export const wrapRootElement = ({ element }) => {
  return (
    <>
      <ToastContextProvider>{element}</ToastContextProvider>
    </>
  );
};
