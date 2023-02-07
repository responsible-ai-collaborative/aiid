import { MenuContextProvider } from 'contexts/MenuContext';
import { UserContextProvider } from 'contexts/userContext';
import React from 'react';
import { wrapRootElement } from './wrapRootElement';

const HeadComponents = [<script key="rollbar" src="/rollbar.js" />];

const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents(HeadComponents);
};

export const wrapPageElement = ({ element }) => {
  return (
    <UserContextProvider>
      <MenuContextProvider>{element}</MenuContextProvider>
    </UserContextProvider>
  );
};

export { onRenderBody, wrapRootElement };
