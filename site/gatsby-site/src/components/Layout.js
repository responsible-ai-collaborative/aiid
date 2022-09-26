import React from 'react';

import Sidebar from './sidebar';
import RightSidebar from './rightSidebar';
import config from '../../config.js';
import Footer from './layout/Footer';
import Header from './ui/Header';

const Layout = ({ children, collapse, className, location }) => (
  <>
    <Header />
    <div className="tw-layout">
      <div className={`tw-hidden-mobile ${collapse ? 'collapse' : ''}`}>
        <Sidebar collapse={collapse} />
      </div>
      {config.sidebar.title && (
        <div
          className={'tw-side-bar-title tw-side-bar-show'}
          dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
        />
      )}
      <div id="content" className="tw-content pb-5">
        <div className={`${className ? className : ''} max-w-5xl 50rem:relative`}>
          {children}
        </div>
      </div>
      <div className={'tw-hidden-mobile tw-[224px] -ml-[24px] z-0 relative 965px:hidden'}>
        <RightSidebar location={location} />
      </div>
    </div>
    <Footer />
  </>
);

export default Layout;
