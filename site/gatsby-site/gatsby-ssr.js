import React from 'react';

import './src/tailwind.css';
import './src/global.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './src/custom.css';

import { wrapRootElement, wrapPageElement } from './gatsby-shared';

export { wrapPageElement, wrapRootElement };

// Gatsby inlines the global stylesheet (about 250 KB) into every HTML page.
// With over 70,000 pages that is most of the HTML in a deploy, and the inlined
// copy cannot be cached between pages. Replace it with a link to the hashed
// CSS file Gatsby writes anyway, which the browser downloads once and keeps.
export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  replaceHeadComponents(
    getHeadComponents().map((component) =>
      component.type === 'style' && component.props['data-href'] ? (
        <link
          key={component.props['data-href']}
          rel="stylesheet"
          href={component.props['data-href']}
        />
      ) : (
        component
      )
    )
  );
};
