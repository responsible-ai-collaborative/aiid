import React from 'react';

export const StyledHeading = ({ children }) => (
  <h1 className="text-3xl leading-6 font-medium flex-1 mt-0 pt-0">{children}</h1>
);

export const StyledMainWrapper = ({ className = '', children }) => (
  <div className={`${className} post-styled-main-wrapper`}>{children}</div>
);
