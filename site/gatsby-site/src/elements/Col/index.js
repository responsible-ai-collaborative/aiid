import React from 'react';

export default function Col(props) {
  return (
    <>
      <div className={`tw-col ${props.className || ''}`}>{props.children}</div>
    </>
  );
}
