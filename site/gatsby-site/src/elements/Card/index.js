import React from 'react';

export default function Card(props) {
  return (
    <>
      <div className={`tw-border tw-rounded-lg tw-flex ${props.className ? props.className : ''}`}>
        {props.children}
      </div>
    </>
  );
}
