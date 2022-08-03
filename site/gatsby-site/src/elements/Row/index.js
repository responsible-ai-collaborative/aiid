import React from 'react';

export default function Row(props) {
  return (
    <>
      <div {...props} className={`tw-row ${props.className || ''} tw-px-3`}>
        {props.children}
      </div>
    </>
  );
}
