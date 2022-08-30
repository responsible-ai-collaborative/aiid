import React from 'react';
import Card from '../Card';

export function StyledTitle(props) {
  return (
    <>
      <div
        className={`flex ml-auto mr-auto mb-2 justify-around items-center w-[85%] max-w-[355px] max-h-[80px] cursor-zoom-in ${
          props.className || ''
        }`}
      >
        {props.children}
      </div>
    </>
  );
}

export function StyledSubtitle(props) {
  return (
    <>
      <Card.Subtitle
        className={`flex ml-auto mr-auto mb-3 justify-around pt-[${props.top || '30px'}] pb-[${
          props.bottom || '30px'
        }] pt-[${props.margin || '-.25rem'}] ${props.className || ''}`}
      >
        {props.children}
      </Card.Subtitle>
    </>
  );
}
