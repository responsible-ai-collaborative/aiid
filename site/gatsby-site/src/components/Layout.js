import React from 'react';
import Sidebar from './sidebar';
import config from '../../config.js';
import Footer from './layout/Footer';
import Header from './ui/Header';
import { useMenuContext } from 'contexts/MenuContext';

const Layout = ({ children, className, location }) => {
  const { sidebar } = useMenuContext();

  return (
    <>
      <Header location={location} />
      <div className="tw-layout">
        <div className="hidden md:block z-2 bg-text-light-gray shadow" data-cy="sidebar-desktop">
          <Sidebar defaultCollapsed={false} location={location} />
        </div>
        {config.sidebar.title && (
          <div
            className={'tw-side-bar-title tw-side-bar-show'}
            dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
          />
        )}
        <div id="content" className={'tw-content' + (sidebar ? ' xl:pr-5' : '')}>
          <div className={`${className ? className : ''} max-w-full`}>{children}</div>
        </div>
        <div
          className={
            'tw-hidden-mobile tw-[224px] z-0 relative hidden xl:block xl:max-w-sm 2xl:max-w-md'
          }
        >
          {sidebar}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
