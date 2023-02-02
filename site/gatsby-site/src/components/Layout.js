import React from 'react';
import Sidebar from './sidebar';
import config from '../../config.js';
import Footer from './layout/Footer';
import Header from './ui/Header';

const Layout = ({ children, className, sidebarCollapsed = false, rightSidebar }) => (
  <>
    <Header />
    <div className="tw-layout">
      <div className="hidden md:block z-2 bg-text-light-gray shadow" data-cy="sidebar-desktop">
        <Sidebar defaultCollapsed={sidebarCollapsed} />
      </div>
      {config.sidebar.title && (
        <div
          className={'tw-side-bar-title tw-side-bar-show'}
          dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
        />
      )}
      <div id="content" className={'tw-content' + (rightSidebar ? ' xl:pr-5' : '')}>
        <div className={`${className ? className : ''} max-50rem:max-w-full max-50rem:relative`}>
          {children}
        </div>
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

export default Layout;
