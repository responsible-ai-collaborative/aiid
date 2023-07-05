import React from 'react';

const classy = (type, className) => {
  const component = (props) =>
    React.createElement(
      type,
      {
        ...props,
        className: [className || '', props.className || ''].filter((e) => e).join(' ') || undefined,
      },
      Array.isArray(props.children) ? props.children : [props.children]
    );

  component.displayName = type;
  return component;
};

const classyDiv = (className) => classy('div', className);

const classySpan = (className) => classy('span', className);

export { classy, classyDiv, classySpan };
