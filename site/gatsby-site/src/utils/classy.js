import React from 'react';

const classy = (type, classStringOrFunction) => {
  const component = (props) => {

    const componentClassName = (
      typeof classStringOrFunction == 'function'
        ? classStringOrFunction(props)
        : classStringOrFunction
    );

    const className = (
      [componentClassName, props.className]
        .filter((e) => e)
        .join(' ') 
    ) || undefined;

    React.createElement(
      type,
      { ...props, className },
      Array.isArray(props.children) ? props.children : [props.children]
    );
  }

  component.displayName = type;
  return component;
};

const classyDiv = (className) => classy('div', className);

const classySpan = (className) => classy('span', className);

export { classy, classyDiv, classySpan };
