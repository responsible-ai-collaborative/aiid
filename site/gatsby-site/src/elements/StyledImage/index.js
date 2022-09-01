import React from 'react';

export function StyledImage(props) {
  return (
    <>
      <img
        {...props}
        alt={props.alt}
        className={`flex ml-auto mr-auto mb-2 justify-around items-center h-[85%] w-auto cursor-zoom-in ${
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
      className={`flex ml-auto mr-auto mb-2 justify-around items-center w-[85%] max-w-[200px] max-h-[80px] ${
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
        className={`flex ml-auto mr-auto mb-[30px] justify-around items-center max-w-[220px] rounded border-black ${
          props.className || ''
        }`}
      />
    </>
  );
}
