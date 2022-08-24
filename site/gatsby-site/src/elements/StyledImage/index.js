import React from 'react';

export function StyledImage(props) {
  return (
    <>
      <img
        {...props}
        alt={props.alt}
        className={`tw-flex tw-ml-auto tw-mr-auto tw-mb-2 tw-justify-around tw-items-center tw-w-[85%] tw-max-w-[200px] tw-max-h-[80px] tw-cursor-zoom-in ${
          props.className || ''
        }`}
      />
    </>
  );
}

function LogoImage(props) {
  return (
    <img
      {...props}
      alt={props.alt}
      className={`tw-flex tw-ml-auto tw-mr-auto tw-mb-2 tw-justify-around tw-items-center tw-w-[85%] tw-max-w-[200px] tw-max-h-[80px] ${
        props.className || ''
      }`}
    />
  );
}

export function StyledImageModal(props) {
  return (
    <>
      {props.linkTo ? (
        <a href={props.linkTo} target="_blank" rel="noreferrer">
          {' '}
          <LogoImage {...props} />{' '}
        </a>
      ) : (
        <LogoImage {...props} />
      )}
    </>
  );
}

export function StyledImageCover(props) {
  return (
    <>
      <img
        {...props}
        alt={props.alt}
        className={`tw-flex tw-ml-auto tw-mr-auto tw-mb-[30px] tw-justify-around tw-items-center tw-max-w-[220px] tw-rounded tw-border-black ${
          props.className || ''
        }`}
      />
    </>
  );
}
