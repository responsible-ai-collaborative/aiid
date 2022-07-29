import React from 'react';
import styled from 'styled-components';

import Sidebar from './sidebar';
import RightSidebar from './rightSidebar';
import config from '../../config.js';
import Footer from './layout/Footer';
import Header from './ui/Header';

const MaxWidth = styled.div`
  @media only screen and (max-width: 50rem) {
    width: 100%;
    position: relative;
  }
`;

const RightSideBarWidth = styled.div`
  width: 224px;
  margin-left: -24px;
  z-index: 0;
  position: relative;

  @media (max-width: 965px) {
    display: none;
  }
`;

const Layout = ({ children, collapse, className, location }) => (
  <>
    <Header />
    <div className="tw-layout">
      <div className={`tw-left-sidebar hiddenMobile ${collapse ? 'collapse' : ''}`}>
        <Sidebar collapse={collapse} />
      </div>
      {config.sidebar.title && (
        <div
          className={'sidebarTitle sideBarShow'}
          dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
        />
      )}
      <div id="content" className="tw-content tw-mb-5">
        <MaxWidth className={className}>{children}</MaxWidth>
      </div>
      <RightSideBarWidth className={'hiddenMobile'}>
        <RightSidebar location={location} />
      </RightSideBarWidth>
    </div>
    <Footer />
  </>
);

export default Layout;
