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

const Heading = ({ level, children }) => {
  const text = getText(children);

  const id = slugify(text, { lower: true });

  const HeadingComponent = `h${level}`;

  return <HeadingComponent id={id}>{children}</HeadingComponent>;
};

export const Heading1 = ({ children }) => <Heading level={1}>{children}</Heading>;
export const Heading2 = ({ children }) => <Heading level={2}>{children}</Heading>;
export const Heading3 = ({ children }) => <Heading level={3}>{children}</Heading>;
export const Heading4 = ({ children }) => <Heading level={4}>{children}</Heading>;
export const Heading5 = ({ children }) => <Heading level={5}>{children}</Heading>;
export const Heading6 = ({ children }) => <Heading level={6}>{children}</Heading>;
