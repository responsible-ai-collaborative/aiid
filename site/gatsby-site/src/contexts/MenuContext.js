import React, { useState, createContext, useContext } from 'react';

const MenuContext = createContext({ isCollapsed: false, collapseMenu: () => {} });

export default MenuContext;

export function MenuContextProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const collapseMenu = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <MenuContext.Provider
      value={{
        isCollapsed,
        collapseMenu,
      }}
    >
      {children}
      {/* <NewSidebarLayout /> */}
    </MenuContext.Provider>
  );
}

export const useMenuContext = () => useContext(MenuContext);
