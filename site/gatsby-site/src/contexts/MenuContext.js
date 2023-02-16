import React, { useState, createContext, useContext } from 'react';

const MenuContext = createContext({
  isCollapsed: false,
  collapseMenu: (value) => {
    value;
  },
  manual: false,
  setManual: (value) => {
    value;
  },
});

export default MenuContext;

export function MenuContextProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [manual, setIsManual] = useState(false);

  const collapseMenu = (value) => {
    setIsCollapsed(value);
  };

  const setManual = (value) => {
    setIsManual(value);
  };

  return (
    <MenuContext.Provider
      value={{
        isCollapsed,
        collapseMenu,
        manual,
        setManual,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export const useMenuContext = () => useContext(MenuContext);
