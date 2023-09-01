import React from 'react';
import Sidebar from './sidebar';
import config from '../../config.js';
import Footer from './layout/Footer';
import Header from './ui/Header';
import { useLayoutContext } from 'contexts/LayoutContext';

const Layout = ({ children, className, sidebarCollapsed = false, location }) => {
  const { rightSidebar } = useLayoutContext();

  return (
    <>
      <Header location={location} className="col-span-2" />

      <main id="content" className={`
        row-start-2 row-span-1 col-start-1 md:col-start-2 col-span-1 
        pt-4 px-4 pb-5 md:px-10 md:pb-10 z-[1] relative flex-1 overflow-clip
        ${rightSidebar ? ' xl:pr-5' : ''}
      `}>
        {children}
      </main>

      <aside className={`
        tw-hidden-mobile tw-[224px] z-0 relative hidden xl:block xl:max-w-sm 2xl:max-w-md
      `}>
        {rightSidebar}
      </aside>

      <aside data-cy="sidebar-desktop" className={`
        row-start-2 row-span-1 col-start-1 col-span-1 
        hidden md:block 
        z-2 
        bg-text-light-gray
        shadow
        w-fit
      `}>
        <Sidebar defaultCollapsed={sidebarCollapsed} location={location} />
      </aside>

      {config.sidebar.title && (
        <div
          className={'tw-side-bar-title tw-side-bar-show'}
          dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
        />
      )}
      <Footer className="col-start-1 col-span-2" />
    </>
  );
};

export default Layout;
