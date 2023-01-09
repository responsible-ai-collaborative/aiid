import React from 'react';
import isString from 'lodash/isString';
import Link from './Link';
import SensitiveImage from '../images/sensitive';
import Button from 'elements/Button';

const slug = (title) => {
  if (isString(title)) {
    return title.toLowerCase().replace(/\s+/g, '');
  }
  if (Array.isArray(title)) {
    return title.map((e) => slug(e)).join('');
  }
  return title.props.children;
};

const Details = ({ children, summary }) => {
  return (
    <details className="my-3">
      <summary className="mb-3">{summary}</summary>
      {children}
    </details>
  );
};

const Components = {
  h1: ({ children }) => <h1 id={slug(children)}>{children}</h1>,
  h2: ({ children }) => <h2 id={slug(children)}>{children}</h2>,
  h3: ({ children }) => <h3 id={slug(children)}>{children}</h3>,
  h4: ({ children }) => <h4 id={slug(children)}>{children}</h4>,
  h5: ({ children }) => <h5 id={slug(children)}>{children}</h5>,
  h6: ({ children }) => <h6 id={slug(children)}>{children}</h6>,
  a: ({ href, ...props }) => <Link {...props} to={href} />,
  Details,
  SensitiveImage,
  Button,
};

export default Components;
