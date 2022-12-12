import React from 'react';
import Sidebar from './sidebar';
import config from '../../config.js';
import Footer from './layout/Footer';
import Header from './ui/Header';

const Layout = ({ children, className, sidebarCollapsed = false, rightSidebar }) => (
  <>
    <Header />
    <div className="tw-layout">
      <div className={`tw-hidden-mobile z-2`}>
        <Sidebar defaultCollapsed={sidebarCollapsed} />
      </div>
      {config.sidebar.title && (
        <div
          className={'tw-side-bar-title tw-side-bar-show'}
          dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
        />
      )}
      <div id="content" className="tw-content pb-5">
        <div className={`${className ? className : ''} 50rem:max-w-full 50rem:relative`}>
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
