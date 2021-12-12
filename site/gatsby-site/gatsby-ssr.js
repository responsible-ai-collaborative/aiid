import Header from 'components/Header';
import React from 'react';
import { wrapRootElement } from './wrapRootElement';

const HeadComponents = [<script key="rollbar" src="/rollbar.js" />];

const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents(HeadComponents);
};

export const wrapPageElement = ({ element }) => {
  return (
    <>
      <Header />
      {element}
    </>
  );
};

export { onRenderBody, wrapRootElement };
