import React, { useState, createContext, useContext, useEffect } from 'react';
import { globalHistory } from '@reach/router';

const LayoutContext = createContext({
  rightSidebar: null,
  displayRightSidebar: (value) => {
    value;
  },
});

export default LayoutContext;

export function LayoutContextProvider({ children }) {
  const [rightSidebar, setRightSidebar] = useState(null);

  useEffect(() => {
    globalHistory.listen(({ action }) => {
      console.log('globalHistory.listen', action);
      if (action === 'PUSH') {
        setRightSidebar(null);
      }
    });
  }, []);

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
