import React from 'react';

const classy = (type, className) => (
  (props) => React.createElement(
    type,
    {...props, className: className + " " + (props.className || '')},
    Array.isArray(props.children) ? props.children : [props.children]
  )
);

const classyDiv = (className) => classy('div', className);

const classySpan = (className) => classy('span', className);

export { classy, classyDiv, classySpan };
