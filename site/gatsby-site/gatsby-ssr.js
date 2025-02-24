// Removed the local Tailwind import since we are now loading it from the static folder.
//import './src/tailwind.css';
import './src/global.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './src/custom.css';
import React from 'react'; // Needed for the JSX element below

import { wrapRootElement, wrapPageElement } from './gatsby-shared';

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([<link key="tailwind-css" rel="stylesheet" href="/tailwind.css" />]);
};

export { wrapPageElement, wrapRootElement };
