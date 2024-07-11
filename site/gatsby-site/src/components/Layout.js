import React from 'react';
import Sidebar from './sidebar';
import config from '../../config.js';
import Footer from './layout/Footer';
import Header from './ui/Header';
import { useLayoutContext } from 'contexts/LayoutContext';
import { useMenuContext } from '../contexts/MenuContext';

const Layout = ({ children, className, sidebarCollapsed = false, location }) => {
  const { rightSidebar } = useLayoutContext();

  const { isCollapsed } = useMenuContext();

  return (
    <>
      <Header location={location} />
      <div className="tw-layout">
        <div
          className="hidden md:block z-[1] bg-text-light-gray shadow"
          data-testid="sidebar-desktop"
        >
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
          className={`flex flex-grow pt-4 px-4 pb-5 md:px-10 md:pb-10 relative flex-1 overflow-clip
            w-full max-w-full ${
              isCollapsed
                ? 'lg:w-content lg:max-w-content'
                : 'lg:w-content-sidebar lg:max-w-content-sidebar'
            }
            ${rightSidebar ? ' xl:pr-5' : ''}`}
        >
          <div className={`${className ? className : ''} w-full max-w-full`}>{children}</div>
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
