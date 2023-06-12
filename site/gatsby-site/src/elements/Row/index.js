import React from 'react';

export default function Row(props) {
  return (
    <div {...props}>
      <div className={`tw-row ${props.className || ''}`}>{props.children}</div>
    </div>
  );
}
