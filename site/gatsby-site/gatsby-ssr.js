import Header from 'components/Header';
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
      <Header />
      {element}
    </UserContextProvider>
  );
};

export { onRenderBody, wrapRootElement };
