import React from 'react';

export default function Card(props) {
  return (
    <>
      <div className={`border rounded flex ${props.className ? props.className : ''}`}>
        {props.children}
      </div>
    </>
  );
}
