import React from 'react';

export default function Form(props) {
  return (
    <>
      <form
        onSubmit={props.onSubmit}
        id={props.id}
        className={props.className ? props.className : ''}
      >
        {props.children}
      </form>
    </>
  );
}
