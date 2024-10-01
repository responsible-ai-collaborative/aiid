import React from 'react';
import { navigate } from 'gatsby';
import { QueryParamProvider } from 'use-query-params';
import { UserContextProvider } from 'contexts/userContext';
import { MenuContextProvider } from 'contexts/MenuContext';
import { ToastContextProvider } from 'contexts/ToastContext';
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

  if (typeof window !== 'undefined') {
    if (process.env.GATSBY_LOCAL_USER_ROLES && process.env.GATSBY_LOCAL_USER_ID) {
      console.log(
        `Setting local user roles for user [${process.env.GATSBY_LOCAL_USER_ID}] and roles [${process.env.GATSBY_LOCAL_USER_ROLES}]`
      );

      const localUserRoles = process.env.GATSBY_LOCAL_USER_ROLES.split(',');

      if (localUserRoles) {
        window.localStorage.setItem('__CUSTOM_DATA_MOCK', JSON.stringify(localUserRoles));
      }
    }
  }

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
      <ToastContextProvider>{element}</ToastContextProvider>
    </>
  );
};
