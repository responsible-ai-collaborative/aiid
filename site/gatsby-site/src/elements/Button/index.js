import { Spinner } from 'flowbite-react';
import React from 'react';

export default function Button(props) {
  let classNames = 'btn';

  if (props.title === 'Flag Report') console.log('--- props.loading', props.loading);

  classNames += props.className ? ` ${props.className}` : '';
  classNames += props.variant ? ` btn-${props.variant}` : '';
  classNames += props.size ? ` btn-${props.size}` : '';
  classNames += props.loading ? ` flex gap-2 justify-center` : '';

  return (
    <>
      {props.href ? (
        <a {...props} className={`${classNames}`} role="button">
          {props.loading && <Spinner />}
          {props.children}
        </a>
      ) : (
        <button {...props} className={`${classNames}`}>
          {props.loading && <Spinner />}
          {props.children}
        </button>
      )}
    </>
  );
}
