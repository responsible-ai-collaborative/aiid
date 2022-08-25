import React from 'react';

import Sidebar from './sidebar';
import config from '../../config.js';
import Footer from './layout/Footer';
import Header from './ui/Header';

const Layout = ({ children, collapse, className }) => (
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
      <div id="content" className="tw-content mb-5">
        <div
          className={`${
            className ? className : ''
          } 50rem:max-w-full 50rem:relative min-767px:max-w-full`}
        >
          {children}
        </div>
      </div>
    </div>
    <Footer />
  </>
);

export default Layout;
