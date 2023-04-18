import Layout from 'components/Layout';
import React, { useState, createContext, useContext } from 'react';

const LayoutContext = createContext({
  className: '',
  setClassName: (value) => {
    value;
  },
  rightSidebar: null,
  setRightSidebar: (value) => {
    value;
  },
});

export default LayoutContext;

export function LayoutContextProvider({ location, children }) {
  const [className, setClassName] = useState('');

  const [rightSidebar, setRightSidebar] = useState(null);

  return (
    <LayoutContext.Provider
      value={{
        className,
        setClassName,
        rightSidebar,
        setRightSidebar,
      }}
    >
      <Layout location={location} rightSidebar={rightSidebar}>
        {children}
      </Layout>
    </LayoutContext.Provider>
  );
}

export const useLayoutContext = () => useContext(LayoutContext);
