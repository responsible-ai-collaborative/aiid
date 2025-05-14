import React from 'react';
import Logo from '../../images/oecd-ai.png';

const OecdLogo = ({ className, width } = { className: '' }) => {
  return (
    <div
      className={['rounded-full border overflow-hidden', className].join(' ')}
      style={{ width, height: width }}
    >
      <img src={Logo} alt="OECD Logo" />
    </div>
  );
};

export default OecdLogo;
