import React from 'react';
import { slugify } from '../utils/slugify';

const getText = (children) => {
  console.log('children:', children); // Log the children structure
  let text = '';

  React.Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      text += child;
    } else if (child.props && child.props.children) {
      text += getText(child.props.children);
    }
  });
  return text;
};

export const Heading1 = ({ children }) => {
  const text = getText(children);

  const id = slugify(text);

  return <h1 id={id}>{children}</h1>;
};

export const Heading2 = ({ children }) => {
  const text = getText(children);

  const id = slugify(text);

  return <h2 id={id}>{children}</h2>;
};

export const Heading3 = ({ children }) => {
  const text = getText(children);

  const id = slugify(text);

  return <h3 id={id}>{children}</h3>;
};

export const Heading4 = ({ children }) => {
  const text = getText(children);

  const id = slugify(text);

  return <h4 id={id}>{children}</h4>;
};

export const Heading5 = ({ children }) => {
  const text = getText(children);

  const id = slugify(text);

  return <h5 id={id}>{children}</h5>;
};

export const Heading6 = ({ children }) => {
  const text = getText(children);

  const id = slugify(text);

  return <h6 id={id}>{children}</h6>;
};
