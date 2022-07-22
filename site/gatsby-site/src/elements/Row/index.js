import React from 'react';

export default function Row(props) {
  return (
    <>
      <div {...props} className={`tw-row ${props.classNames || ''} tw-mt-6 tw-mb-4`}>
        {props.children}
      </div>
    </>
  );
}
