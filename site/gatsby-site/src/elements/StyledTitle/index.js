import React from 'react';
import Card from '../Card';

export function StyledTitle(props) {
  return (
    <>
      <div
        className={`tw-flex tw-ml-auto tw-mr-auto tw-mb-2 tw-justify-around tw-items-center tw-w-[85%] tw-max-w-[355px] tw-max-h-[80px] tw-cursor-zoom-in ${
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
        className={`tw-flex tw-ml-auto tw-mr-auto tw-mb-2 tw-justify-around tw-pt-[${
          props.top || '30px'
        }] tw-pb-[${props.bottom || '30px'}] tw-pt-[${props.margin || '-.25rem'}] ${
          props.className || ''
        }`}
      >
        {props.children}
      </Card.Subtitle>
    </>
  );
}
