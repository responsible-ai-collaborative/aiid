import React from 'react';

export default function Container(props) {
  return (
    <>
      <div className={`tw-main-container ${props.className || ''}`}>{props.children}</div>
    </>
  );
}
