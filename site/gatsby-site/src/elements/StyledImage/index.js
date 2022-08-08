import React from 'react';

export function StyledImage({ src, onClick, dataCy, className }) {
  let props = {};

  if (src) props['src'] = src;
  if (onClick) props['onClick'] = onClick;
  if (dataCy) props['data-cy'] = dataCy;

  return (
    <>
      <img
        {...props}
        alt={props.alt}
        className={`tw-flex tw-ml-auto tw-mr-auto tw-mb-2 tw-justify-around tw-items-center tw-w-[85%] tw-max-w-[355px] tw-max-h-[80px] tw-cursor-zoom-in ${
          className || ''
        }`}
      />
    </>
  );
}

export function StyledImageModal({ src, onClick, dataCy, className }) {
  let props = {};

  if (src) props['src'] = src;
  if (onClick) props['onClick'] = onClick;
  if (dataCy) props['data-cy'] = dataCy;

  return (
    <>
      <img
        {...props}
        alt={props.alt}
        className={`tw-flex tw-ml-auto tw-mr-auto tw-mb-2 tw-justify-around tw-items-center tw-w-[85%] tw-max-w-[355px] tw-max-h-[80px] ${
          className || ''
        }`}
      />
    </>
  );
}

export function StyledImageCover({ src, onClick, dataCy, className }) {
  let props = {};

  if (src) props['src'] = src;
  if (onClick) props['onClick'] = onClick;
  if (dataCy) props['data-cy'] = dataCy;

  return (
    <>
      <img
        {...props}
        alt={props.alt}
        className={`tw-flex tw-ml-auto tw-mr-auto tw-mb-[30px] tw-justify-around tw-items-center tw-max-w-[220px] tw-rounded tw-border-black ${
          className || ''
        }`}
      />
    </>
  );
}
