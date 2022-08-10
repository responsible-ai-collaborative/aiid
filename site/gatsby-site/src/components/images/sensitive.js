import React, { useState } from 'react';
import { Trans } from 'react-i18next';

const SensitiveImage = (props) => {
  const [blurred, setBlurred] = useState(true);

  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      <button
        onClick={() => setBlurred(!blurred)}
        style={{
          position: 'absolute',
          top: '0px',
          bottom: '0px',
          left: '0px',
          right: '0px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          background: 'rgba(0,0,0,0)',
          border: '0px',
          width: '100%',
        }}
      >
        {blurred && (
          <span
            style={{
              background: 'white',
              padding: '1em',
              borderRadius: '.25em',
            }}
          >
            <Trans>Sensitive: Click to view</Trans>
          </span>
        )}
      </button>
      <img style={blurred ? { filter: 'blur(20px)' } : {}} alt={props.alt} {...props} />
    </div>
  );
};

export default SensitiveImage;
