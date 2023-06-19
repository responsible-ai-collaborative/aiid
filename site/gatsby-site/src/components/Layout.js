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
      <Header location={location} />
      <div className="tw-layout">
        <div className="hidden md:block z-2 bg-text-light-gray shadow" data-cy="sidebar-desktop">
          <Sidebar defaultCollapsed={sidebarCollapsed} location={location} />
        </div>
        {config.sidebar.title && (
          <div
            className={'tw-side-bar-title tw-side-bar-show'}
            dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
          />
        )}
        <div
          id="content"
          className={
            'flex flex-grow pt-4 px-4 pb-5 md:px-10 md:pb-10 z-[1] relative overflow-hidden flex-1' +
            (rightSidebar ? ' xl:pr-5' : '')
          }
        >
          <div className={`${className ? className : ''} max-w-full`}>{children}</div>
        </div>
        <div
          className={
            'tw-hidden-mobile tw-[224px] z-0 relative hidden xl:block xl:max-w-sm 2xl:max-w-md'
          }
        >
          {rightSidebar}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
