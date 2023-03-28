import React from 'react';

export const StyledHeading = ({ children }) => (
  <h1 className="font-karla font-bold flex-1 pt-0">{children}</h1>
);

export const Edit = ({ children }) => <div className="edit-div">{children}</div>;

export const StyledMainWrapper = ({ children }) => (
  <div className="styled-main-wrapper">{children}</div>
);
