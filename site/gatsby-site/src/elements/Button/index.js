import React from 'react';

export default function Button(props) {
  let classNames = 'tw-btn';

  classNames += props.className ? ` ${props.className}` : '';
  classNames += props.variant ? ` tw-btn-${props.variant}` : '';
  classNames += props.size ? ` tw-btn-${props.size}` : '';

  return (
    <>
      {props.href ? (
        <a {...props} className={`${classNames}`} role="button">
          {props.children}
        </a>
      ) : (
        <button {...props} className={`${classNames}`}>
          {props.children}
        </button>
      )}
    </>
  );
}
