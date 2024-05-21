import React from 'react';
import slugify from 'slugify';

const getText = (children) => {
  // Recursively find all text nodes in the children
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

  const id = slugify(text, { lower: true });

  return <h1 id={id}>{children}</h1>;
};

export const Heading2 = ({ children }) => {
  const text = getText(children);

  const id = slugify(text, { lower: true });

  return <h2 id={id}>{children}</h2>;
};

export const Heading3 = ({ children }) => {
  const text = getText(children);

  const id = slugify(text, { lower: true });

  return <h3 id={id}>{children}</h3>;
};

export const Heading4 = ({ children }) => {
  const text = getText(children);

  const id = slugify(text, { lower: true });

  return <h4 id={id}>{children}</h4>;
};

export const Heading5 = ({ children }) => {
  const text = getText(children);

  const id = slugify(text, { lower: true });

  return <h5 id={id}>{children}</h5>;
};

export const Heading6 = ({ children }) => {
  const text = getText(children);

  const id = slugify(text, { lower: true });

  return <h6 id={id}>{children}</h6>;
};
