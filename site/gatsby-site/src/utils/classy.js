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

    return React.createElement(
      type,
      { ...props, className },
      Array.isArray(props.children) ? props.children : [props.children]
    );
  }

  component.displayName = 'Classy' + type.slice(0, 1).toUpperCase() + type.slice(1);

  return component;
};

const classyDiv = (className) => classy('div', className);

const classySpan = (className) => classy('span', className);

export { classy, classyDiv, classySpan };
