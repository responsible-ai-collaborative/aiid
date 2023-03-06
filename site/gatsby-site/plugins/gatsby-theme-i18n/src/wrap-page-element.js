import * as React from 'react';
import { LocaleProvider } from './context';
import { SEO } from './components/seo';

const wrapPageElement = ({ element, props }) => (
  <LocaleProvider pageContext={props.pageContext}>
    <SEO location={props.location} pageContext={props.pageContext} />
    {element}
  </LocaleProvider>
);

export { wrapPageElement };
