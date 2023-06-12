import React from 'react';

export default function Row(props) {
  return (
    <>
      <div className={`tw-row ${props.className || ''}`}>{props.children}</div>
    </>
  );
}
