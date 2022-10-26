import React, { useState, createContext, useContext } from 'react';

const MenuContext = createContext({
  isCollapsed: false,
  collapseMenu: (value) => {
    value;
  },
});

export default MenuContext;

export function MenuContextProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const collapseMenu = (value) => {
    setIsCollapsed(value);
  };

  return (
    <MenuContext.Provider
      value={{
        isCollapsed,
        collapseMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export const useMenuContext = () => useContext(MenuContext);
