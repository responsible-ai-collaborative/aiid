import React from 'react';
import isAbsoluteUrl from 'is-absolute-url';
import { LocalizedLink } from 'gatsby-theme-i18n';

const Link = ({ to, ...props }) =>
  isAbsoluteUrl(to) ? (
    <a href={to} {...props}>
      {props.children}
    </a>
  ) : (
    <LocalizedLink to={to} {...props} />
  );

export default Link;
