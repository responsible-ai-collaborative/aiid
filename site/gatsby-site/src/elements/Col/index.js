import React from 'react';

export default function Col(props) {
  return (
    <>
      <div {...props} className={`tw-col ${props.classNames || ''}`}>
        {props.children}
      </div>
    </>
  );
}
