import React, { useState, createContext, useContext } from 'react';

const LayoutContext = createContext({
  rightSidebar: null,
  displayRightSidebar: (value) => {
    value;
  },
});

export default LayoutContext;

export function LayoutContextProvider({ children }) {
  const [rightSidebar, setRightSidebar] = useState(null);

  const displayRightSidebar = (value) => {
    setRightSidebar(value);
  };

  return (
    <LayoutContext.Provider
      value={{
        rightSidebar,
        displayRightSidebar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayoutContext = () => useContext(LayoutContext);
