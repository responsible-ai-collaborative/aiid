import React from 'react';

export default function Row(props) {
  return (
    <>
      <div {...props} className={`tw-row ${props.className || ''}`}>
        {props.children}
      </div>
    </>
  );
}
