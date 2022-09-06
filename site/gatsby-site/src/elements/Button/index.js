import { Spinner } from 'flowbite-react';
import React from 'react';

export default function Button({
  variant,
  size = null,
  href = null,
  disabled = false,
  loading = false,
  ...props
}) {
  let classNames = 'btn';

  classNames += props.className ? ` ${props.className}` : '';
  classNames += variant ? ` btn-${variant}` : '';
  classNames += size ? ` btn-${size}` : '';
  classNames += loading ? ` flex gap-2 justify-center` : '';

  return (
    <>
      {href ? (
        <a {...props} className={`${classNames}`} role="button">
          {loading && <Spinner />}
          {props.children}
        </a>
      ) : (
        <button {...props} disabled={disabled} className={`${classNames}`}>
          {loading && <Spinner />}
          {props.children}
        </button>
      )}
    </>
  );
}
