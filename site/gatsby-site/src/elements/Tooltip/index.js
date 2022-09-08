import React from 'react';

export default function Tooltipss(props) {
  return (
    <>
      <div className={`tw-tooltip-${props.placement} tw-group tw-tooltip-wrapper`}>
        {props.children}
        <div className="tw-tooltip group-hover:opacity-100">
          <span className="tw-tooltip-arrow"></span>
          {props.text}
        </div>
      </div>
    </>
  );
}
