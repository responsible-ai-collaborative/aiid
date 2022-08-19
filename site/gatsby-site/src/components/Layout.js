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
      <div id="content" className="tw-content tw-mb-5">
        <div
          className={`${
            className ? className : ''
          } 50rem:tw-max-w-full 50rem:tw-relative min-767px:tw-max-w-full`}
        >
          {children}
        </div>
      </div>
      <div
        className={'tw-hidden-mobile tw-w-[224px] tw-ml-[-24px] tw-z-0 tw-relative 965px:tw-hidden'}
      >
        <RightSidebar location={location} />
      </div>
    </div>
    <Footer />
  </>
);

export default Layout;
